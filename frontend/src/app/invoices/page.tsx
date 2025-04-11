'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setUploadResult(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aws/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      setUploadResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Invoice Management</h1>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Upload Invoice</h2>
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Invoice File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${
                    isUploading || !file ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Invoice'}
                </button>
              </form>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {uploadResult && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  <p className="font-medium">Upload successful!</p>
                  <p className="mt-1">File ID: {uploadResult.key.split('/').pop()}</p>
                  <a 
                    href={uploadResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-600 hover:underline"
                  >
                    View Uploaded File
                  </a>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Scan Invoice</h2>
              <p className="text-gray-600 mb-4">Use your device camera to capture and analyze invoice data.</p>
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => alert('Camera feature coming soon!')}
              >
                Open Camera
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Email Inbox</h2>
              <p className="text-gray-600 mb-4">View and process invoices received via email.</p>
              <Link 
                href="/invoices/inbox"
                className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Check Inbox
              </Link>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Recent Invoices</h2>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-center text-gray-500 py-8">No invoices found. Upload your first invoice to get started.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 