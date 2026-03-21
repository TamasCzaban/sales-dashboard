package store

import (
	"math"
	"sort"
	"sync"
	"time"

	"github.com/czdev/sales-dashboard/backend/internal/model"
)

type Store interface {
	SaveRecords(records []model.SaleRecord)
	GetRevenueTrend(from, to string, groupBy string) ([]model.RevenuePeriod, float64)
	GetProductBreakdown(top int, sortBy string) []model.ProductTotal
	GetChurnSignals(windowDays int) ([]model.CustomerFrequency, model.ChurnSummary)
	HasData() bool
}

type MemoryStore struct {
	mu      sync.RWMutex
	records []model.SaleRecord
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		records: make([]model.SaleRecord, 0),
	}
}

func (s *MemoryStore) SaveRecords(records []model.SaleRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.records = append(s.records, records...)
}

func (s *MemoryStore) GetRevenueTrend(from, to string, groupBy string) ([]model.RevenuePeriod, float64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var fromDate, toDate time.Time
	if from != "" {
		fromDate, _ = time.Parse("2006-01-02", from)
	}
	if to != "" {
		toDate, _ = time.Parse("2006-01-02", to)
	}

	buckets := map[string]*model.RevenuePeriod{}
	var totalRevenue float64

	for _, r := range s.records {
		if !fromDate.IsZero() && r.Date.Before(fromDate) {
			continue
		}
		if !toDate.IsZero() && r.Date.After(toDate) {
			continue
		}

		var key string
		switch groupBy {
		case "day":
			key = r.Date.Format("2006-01-02")
		case "week":
			y, w := r.Date.ISOWeek()
			key = time.Date(y, 1, 1, 0, 0, 0, 0, time.UTC).AddDate(0, 0, (w-1)*7).Format("2006-01-02")
		default:
			key = r.Date.Format("2006-01")
		}

		b, ok := buckets[key]
		if !ok {
			b = &model.RevenuePeriod{Period: key}
			buckets[key] = b
		}
		b.Revenue += r.TotalAmount
		b.OrderCount++
		totalRevenue += r.TotalAmount
	}

	periods := make([]model.RevenuePeriod, 0, len(buckets))
	for _, b := range buckets {
		b.Revenue = math.Round(b.Revenue*100) / 100
		periods = append(periods, *b)
	}
	sort.Slice(periods, func(i, j int) bool { return periods[i].Period < periods[j].Period })

	return periods, math.Round(totalRevenue*100) / 100
}

func (s *MemoryStore) GetProductBreakdown(top int, sortBy string) []model.ProductTotal {
	s.mu.RLock()
	defer s.mu.RUnlock()

	type acc struct {
		revenue  float64
		quantity int
	}
	products := map[string]*acc{}
	var totalRevenue float64

	for _, r := range s.records {
		p, ok := products[r.Product]
		if !ok {
			p = &acc{}
			products[r.Product] = p
		}
		p.revenue += r.TotalAmount
		p.quantity += r.Quantity
		totalRevenue += r.TotalAmount
	}

	result := make([]model.ProductTotal, 0, len(products))
	for name, p := range products {
		pct := 0.0
		if totalRevenue > 0 {
			pct = math.Round(p.revenue/totalRevenue*1000) / 10
		}
		result = append(result, model.ProductTotal{
			Product:       name,
			TotalRevenue:  math.Round(p.revenue*100) / 100,
			TotalQuantity: p.quantity,
			Percentage:    pct,
		})
	}

	if sortBy == "quantity" {
		sort.Slice(result, func(i, j int) bool { return result[i].TotalQuantity > result[j].TotalQuantity })
	} else {
		sort.Slice(result, func(i, j int) bool { return result[i].TotalRevenue > result[j].TotalRevenue })
	}

	if top > 0 && top < len(result) {
		result = result[:top]
	}

	return result
}

func (s *MemoryStore) GetChurnSignals(windowDays int) ([]model.CustomerFrequency, model.ChurnSummary) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if len(s.records) == 0 {
		return []model.CustomerFrequency{}, model.ChurnSummary{}
	}

	// Group records by customer and month
	type custMonth struct {
		customer string
		month    string
	}
	counts := map[custMonth]int{}
	months := map[string]bool{}

	for _, r := range s.records {
		m := r.Date.Format("2006-01")
		months[m] = true
		counts[custMonth{r.CustomerID, m}]++
	}

	// Sort months chronologically
	sortedMonths := make([]string, 0, len(months))
	for m := range months {
		sortedMonths = append(sortedMonths, m)
	}
	sort.Strings(sortedMonths)

	// Build per-customer frequency windows
	customers := map[string]bool{}
	for _, r := range s.records {
		customers[r.CustomerID] = true
	}

	var results []model.CustomerFrequency
	summary := model.ChurnSummary{TotalCustomers: len(customers)}

	for cid := range customers {
		windows := make([]model.CustomerWindow, 0, len(sortedMonths))
		for _, m := range sortedMonths {
			windows = append(windows, model.CustomerWindow{
				Period:    m,
				Purchases: counts[custMonth{cid, m}],
			})
		}

		trend := classifyTrend(windows)
		results = append(results, model.CustomerFrequency{
			CustomerID: cid,
			Windows:    windows,
			Trend:      trend,
		})

		switch trend {
		case "declining":
			summary.Declining++
		case "growing":
			summary.Growing++
		default:
			summary.Stable++
		}
	}

	sort.Slice(results, func(i, j int) bool { return results[i].CustomerID < results[j].CustomerID })

	return results, summary
}

func classifyTrend(windows []model.CustomerWindow) string {
	if len(windows) < 2 {
		return "stable"
	}

	// Compare first half average to second half average
	mid := len(windows) / 2
	var firstSum, secondSum float64
	for i := 0; i < mid; i++ {
		firstSum += float64(windows[i].Purchases)
	}
	for i := mid; i < len(windows); i++ {
		secondSum += float64(windows[i].Purchases)
	}
	firstAvg := firstSum / float64(mid)
	secondAvg := secondSum / float64(len(windows)-mid)

	if secondAvg < firstAvg*0.7 {
		return "declining"
	}
	if secondAvg > firstAvg*1.3 {
		return "growing"
	}
	return "stable"
}

func (s *MemoryStore) HasData() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.records) > 0
}
