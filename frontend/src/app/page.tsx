"use client";

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ChatInterface from '@/components/ChatInterface';
import AnalysisResults from '@/components/AnalysisResults';
import axios from 'axios';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fullText, setFullText] = useState<string | null>(null);

  const handleUploadComplete = async (data: any) => {
    // Data contains full_content
    if (data.full_content) {
      setFullText(data.full_content);
      // Automatically trigger analysis
      await triggerAnalysis(data.full_content);
    }
  };

  const triggerAnalysis = async (text: string) => {
    setAnalyzing(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/analyze', {
        text: text
      });
      setAnalysisData(response.data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Financial Insights AI</h1>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">

        {/* Left Column: Upload & Chat */}
        <div className="space-y-8 flex flex-col">
          <section className="bg-white rounded-xl shadow-sm p-1">
            <FileUpload onUploadComplete={handleUploadComplete} />
          </section>

          <section className="flex-1">
            <ChatInterface />
          </section>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="h-full min-h-[500px]">
          {analyzing ? (
            <div className="h-full bg-white rounded-xl shadow-sm flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Analysing Document...</h3>
                <p className="text-gray-500">Extracting insights, generating summaries and questions.</p>
              </div>
            </div>
          ) : analysisData ? (
            <AnalysisResults data={analysisData} />
          ) : (
            <div className="h-full bg-white rounded-xl shadow-sm flex flex-col items-center justify-center p-12 text-center text-gray-400 border-2 border-dashed border-gray-200">
              <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
              <p>Upload a document to view AI-generated insights, summaries and analytics.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
