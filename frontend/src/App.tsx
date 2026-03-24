import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import KpiPage from "./pages/KpiPage";
import CustomerInsightsPage from "./pages/CustomerInsightsPage";
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/kpis" element={<KpiPage />} />
        <Route path="/customers" element={<CustomerInsightsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
