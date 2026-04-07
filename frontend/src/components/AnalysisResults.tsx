"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, HelpCircle, BarChart as BarChartIcon } from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface MCQ {
    question: string;
    options: string[];
    correct_answer?: string;
    answer?: string; // in case of simplified response
}

interface ChartData {
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: { name: string; value: number }[];
    insights?: string;
}

interface AnalysisData {
    summary: string;
    mcqs: MCQ[] | any;
    analytics: {
        charts?: ChartData[];
        text_analysis?: string;
        insights?: string; // legacy support
    } | string; // legacy support if string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalysisResults({ data }: { data: AnalysisData }) {
    const [activeTab, setActiveTab] = useState<'summary' | 'mcq' | 'analytics'>('summary');

    const renderChart = (chart: ChartData, index: number) => {
        return (
            <div key={index} className="mb-8 p-4 border rounded-lg shadow-sm bg-white">
                <h4 className="text-md font-semibold mb-4 text-center text-gray-900">{chart.title}</h4>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chart.type === 'bar' ? (
                            <BarChart data={chart.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        ) : chart.type === 'line' ? (
                            <LineChart data={chart.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                            </LineChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={chart.data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {chart.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
                {chart.insights && (
                    <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">{chart.insights}</p>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white border rounded-lg shadow-sm h-full flex flex-col">
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText size={16} />
                    <span>Summary</span>
                </button>
                <button
                    onClick={() => setActiveTab('mcq')}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'mcq' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <HelpCircle size={16} />
                    <span>Q&A / MCQs</span>
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BarChartIcon size={16} />
                    <span>Analytics</span>
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'summary' && (
                    <div className="prose prose-sm max-w-none text-gray-700">
                        <h3 className="text-lg font-semibold mb-2">Document Summary</h3>
                        <ReactMarkdown>{data.summary || "No summary available."}</ReactMarkdown>
                    </div>
                )}

                {activeTab === 'mcq' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Generated Questions</h3>
                        {Array.isArray(data.mcqs) && data.mcqs.length > 0 ? (
                            data.mcqs.map((q: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-md border text-gray-900">
                                    <p className="font-medium mb-2 text-black">{idx + 1}. {q.question}</p>
                                    {q.options?.length > 0 ? (
                                        <ul className="space-y-1">
                                            {q.options.map((opt: string, i: number) => (
                                                <li key={i} className="flex items-center space-x-2">
                                                    <input type="radio" name={`q-${idx}`} disabled className="text-blue-600" />
                                                    <span className="text-sm text-gray-900">{opt}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-sm text-red-500">
                                            {q.raw && <p>Raw Output: {q.raw}</p>}
                                        </div>
                                    )}
                                    {q.correct_answer && (
                                        <p className="text-xs text-green-600 mt-2 font-medium">Answer: {q.correct_answer}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="prose prose-sm">
                                <p>No questions generated or format error.</p>
                                <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data.mcqs, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-2">Financial Insights</h3>

                        {/* Structured Charts */}
                        {typeof data.analytics !== 'string' && data.analytics?.charts && data.analytics.charts.length > 0 ? (
                            <div>
                                {data.analytics.charts.map((chart, idx) => renderChart(chart, idx))}
                            </div>
                        ) : null}

                        {/* Text Analysis Fallback */}
                        <div className="prose prose-sm max-w-none text-gray-900 mt-4">
                            {typeof data.analytics === 'string' ? (
                                <ReactMarkdown>{data.analytics}</ReactMarkdown>
                            ) : (
                                <ReactMarkdown>
                                    {data.analytics?.text_analysis || data.analytics?.insights || (data.analytics?.charts?.length ? "" : "No analytics data available.")}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
