import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import { uploadCSV } from "../api/client";
import type { UploadResult } from "../types/sales";

function UploadPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const response = await uploadCSV(file);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setResult(response.data);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch {
      setError("Failed to upload file. Is the backend running?");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Upload Sales Data
      </h1>
      <p className="text-gray-600 mb-8">
        Upload a CSV file with columns: date, customer_id, product, quantity,
        unit_price, total_amount
      </p>
      <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          Imported {result.rows_imported} rows
          {result.rows_skipped > 0 && ` (${result.rows_skipped} skipped)`}.
          Redirecting to dashboard...
        </div>
      )}
    </div>
  );
}

export default UploadPage;
