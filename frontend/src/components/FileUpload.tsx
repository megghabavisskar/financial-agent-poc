"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUpload({ onUploadComplete }: { onUploadComplete: (data: any) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            let endpoint = '';
            if (file.name.toLowerCase().endsWith('.pdf')) {
                endpoint = 'http://localhost:8000/api/v1/ingest/pdf';
            } else if (file.name.toLowerCase().endsWith('.csv')) {
                endpoint = 'http://localhost:8000/api/v1/ingest/csv';
            } else {
                throw new Error('Unsupported file type. Please upload PDF or CSV.');
            }

            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onUploadComplete(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full">
                    <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Upload Financial Document</h3>
                    <p className="text-sm text-gray-500">PDF or CSV files supported</p>
                </div>

                <input
                    type="file"
                    accept=".pdf,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
                />

                {file && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                        <FileText className="w-4 h-4" />
                        <span>{file.name}</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center space-x-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${!file || uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </span>
                    ) : (
                        'Analyze Document'
                    )}
                </button>
            </div>
        </div>
    );
}
