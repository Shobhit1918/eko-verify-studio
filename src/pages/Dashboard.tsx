
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Shield, Clock, DollarSign, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardPageProps {
  results: any[];
  credits: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ results = [], credits = 0 }) => {
  // Sample data for demonstration
  const usageData = [
    { name: 'Jan', employmentVerification: 120, gstinVerification: 80, vehicleVerification: 60, financialServices: 40 },
    { name: 'Feb', employmentVerification: 150, gstinVerification: 95, vehicleVerification: 75, financialServices: 55 },
    { name: 'Mar', employmentVerification: 180, gstinVerification: 110, vehicleVerification: 90, financialServices: 70 },
    { name: 'Apr', employmentVerification: 200, gstinVerification: 125, vehicleVerification: 100, financialServices: 85 },
    { name: 'May', employmentVerification: 220, gstinVerification: 140, vehicleVerification: 115, financialServices: 95 },
    { name: 'Jun', employmentVerification: 250, gstinVerification: 160, vehicleVerification: 130, financialServices: 110 }
  ];

  const apiUsageData = [
    { name: 'Employment Verification', value: 45, color: '#3B82F6' },
    { name: 'GSTIN Verification', value: 25, color: '#10B981' },
    { name: 'Vehicle Verification', value: 15, color: '#F59E0B' },
    { name: 'Financial Services', value: 10, color: '#8B5CF6' },
    { name: 'Healthcare', value: 3, color: '#EF4444' },
    { name: 'Education', value: 2, color: '#6366F1' }
  ];

  const successRateData = [
    { name: 'Mon', successRate: 98.5, totalCalls: 145 },
    { name: 'Tue', successRate: 97.8, totalCalls: 162 },
    { name: 'Wed', successRate: 99.1, totalCalls: 178 },
    { name: 'Thu', successRate: 98.9, totalCalls: 195 },
    { name: 'Fri', successRate: 99.3, totalCalls: 220 },
    { name: 'Sat', successRate: 98.7, totalCalls: 185 },
    { name: 'Sun', successRate: 99.0, totalCalls: 155 }
  ];

  const totalAPICalls = results.length;
  const successfulCalls = results.filter(r => r.status === 'SUCCESS').length;
  const successRate = totalAPICalls > 0 ? (successfulCalls / totalAPICalls * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Studio</span>
              </Link>
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/cb6255c2-8a31-4856-b9b4-3aaf40ed7f92.png" 
                  alt="EKO Logo" 
                  className="h-10 w-auto"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-900">Analytics Dashboard</span>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                Powered by EKO API
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total API Calls</p>
                <p className="text-2xl font-bold text-blue-900">{totalAPICalls.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12.5% from last month</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-green-900">{successRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+0.8% from last week</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Wallet Credits</p>
                <p className="text-2xl font-bold text-purple-900">{credits.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <DollarSign className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-xs text-purple-600">₹{(credits * 0.5).toFixed(2)} value</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-900">1.2s</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">-0.3s improvement</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* API Usage Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">API Usage Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="employmentVerification" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="gstinVerification" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="vehicleVerification" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="financialServices" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Service Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={apiUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {apiUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Success Rate Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Success Rate Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[95, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="successRate" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Daily API Calls */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily API Calls</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalCalls" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent API Activity</h3>
          <div className="space-y-3">
            {results.slice(-10).reverse().map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={result.status === 'SUCCESS' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                  <span className="font-medium">{result.service}</span>
                  <span className="text-slate-600 text-sm">{result.category}</span>
                </div>
                <div className="text-sm text-slate-500">
                  {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : 'Just now'}
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No API activity yet. Start using the verification services to see data here.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
