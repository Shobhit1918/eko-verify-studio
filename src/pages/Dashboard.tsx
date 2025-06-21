import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Users, CheckCircle, AlertTriangle, BarChart3, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  results: any[];
  credits: number;
}

const Dashboard: React.FC<DashboardProps> = ({ results, credits }) => {
  const successRate = results.length > 0 ? (results.filter(r => r.status === 'SUCCESS').length / results.length * 100).toFixed(1) : 0;
  const failureRate = results.length > 0 ? (results.filter(r => r.status === 'FAILED').length / results.length * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/cb6255c2-8a31-4856-b9b4-3aaf40ed7f92.png" 
                  alt="EKO Logo" 
                  className="h-10 w-auto"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-900">Eko Shield</span>
                  <span className="text-lg text-slate-600">- Analytics Dashboard</span>
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
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Verifications</p>
                <p className="text-3xl font-bold text-blue-900">{results.length}</p>
                <p className="text-xs text-blue-500 mt-1">+12% from last month</p>
              </div>
              <BarChart3 className="h-10 w-10 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-green-900">{successRate}%</p>
                <p className="text-xs text-green-500 mt-1">+2.5% improvement</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Failure Rate</p>
                <p className="text-3xl font-bold text-red-900">{failureRate}%</p>
                <p className="text-xs text-red-500 mt-1">-1.2% from last month</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Credits Remaining</p>
                <p className="text-3xl font-bold text-purple-900">{credits}</p>
                <p className="text-xs text-purple-500 mt-1">Active wallet balance</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Verification Trends</h3>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Chart visualization would go here</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Usage</h3>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Service breakdown chart would go here</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Verification Activity</h3>
          <div className="space-y-3">
            {results.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No verification activity yet</p>
            ) : (
              results.slice(0, 10).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      result.status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {result.status === 'SUCCESS' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{result.service}</p>
                      <p className="text-sm text-slate-500">{result.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={result.status === 'SUCCESS' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {result.timestamp?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
