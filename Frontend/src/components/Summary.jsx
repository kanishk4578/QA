import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Summary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState({
    favor: 65,
    against: 35,
    pros: [
      "Increases economic growth and job opportunities",
      "Promotes innovation and technological advancement",
      "Enhances global competitiveness",
      "Improves living standards for many citizens"
    ],
    cons: [
      "May lead to environmental degradation",
      "Could increase income inequality",
      "Potential displacement of traditional industries",
      "Risk of cultural homogenization"
    ],
    sentiment: "Positive"
  });

  // Simulate API call
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock summary data
        setSummary({
          title: "Economic Development Policy Analysis",
          content: "Based on comprehensive analysis of responses, this policy proposal shows significant support among stakeholders. The initiative focuses on sustainable economic growth while addressing environmental concerns.",
          generatedAt: new Date().toLocaleDateString(),
          totalResponses: 1247
        });
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const chartData = [
    { name: 'In Favor', value: sentimentData.favor, color: '#10B981' },
    { name: 'Against', value: sentimentData.against, color: '#EF4444' }
  ];

  const barData = [
    { name: 'Positive', value: sentimentData.favor, fill: '#10B981' },
    { name: 'Negative', value: sentimentData.against, fill: '#EF4444' }
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl text-gray-700 font-medium">Analyzing responses and generating insights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Summary Available</h2>
            <p className="text-gray-600">No summary found for this question. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            📊 Analysis Summary
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive insights from community responses</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Responses</h3>
                <p className="text-3xl font-bold text-gray-900">{summary.totalResponses?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overall Sentiment</h3>
                <p className={`text-3xl font-bold ${sentimentData.sentiment === 'Positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {sentimentData.sentiment}
                </p>
              </div>
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">💝</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Generated On</h3>
                <p className="text-3xl font-bold text-gray-900">{summary.generatedAt}</p>
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Summary Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              Summary Analysis
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{summary.title}</h3>
                <p className="text-gray-600 leading-relaxed">{summary.content}</p>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-red-600 rounded-full"></div>
              Sentiment Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">In Favor ({sentimentData.favor}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Against ({sentimentData.against}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pros */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">📈</span>
              </div>
              <span className="text-green-600">Pros</span>
            </h2>
            <ul className="space-y-4">
              {sentimentData.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-green-700">Positive:</span> {pro}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">📉</span>
              </div>
              <span className="text-red-600">Cons</span>
            </h2>
            <ul className="space-y-4">
              {sentimentData.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-red-700">Negative:</span> {con}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            Response Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;