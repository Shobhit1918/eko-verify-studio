import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Building2, Car, Factory, FileCheck, Download, Upload, Search, BarChart3, Wallet, ArrowRight, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import EmploymentVerification from "@/components/verification/EmploymentVerification";
import GSTINVerification from "@/components/verification/GSTINVerification";
import VehicleVerification from "@/components/verification/VehicleVerification";
import FinancialVerification from "@/components/verification/FinancialVerification";
import HealthcareVerification from "@/components/verification/HealthcareVerification";
import EducationVerification from "@/components/verification/EducationVerification";
import UnifiedVerification from "@/components/verification/UnifiedVerification";
import APIKeyInput from "@/components/common/APIKeyInput";
import BulkUpload from "@/components/common/BulkUpload";
import ResultsManager from "@/components/common/ResultsManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("unified");
  const [apiKey, setApiKey] = useState("");
  const [results, setResults] = useState([]);
  const [credits, setCredits] = useState(2500); // Initial credits
  const [transactions, setTransactions] = useState([]);

  const verificationCategories = [
    {
      id: "unified",
      label: "Multi-Service Verification",
      icon: Shield,
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
      services: "All"
    },
    {
      id: "employment",
      label: "Employment Verification",
      icon: Building2,
      color: "bg-blue-500",
      services: 9
    },
    {
      id: "gstin",
      label: "GSTIN Verification",
      icon: FileCheck,
      color: "bg-green-500",
      services: 1
    },
    {
      id: "vehicle",
      label: "Vehicle Verification",
      icon: Car,
      color: "bg-orange-500",
      services: 2
    },
    {
      id: "financial",
      label: "Financial Services",
      icon: Shield,
      color: "bg-purple-500",
      services: 4
    },
    {
      id: "healthcare",
      label: "Healthcare & Insurance",
      icon: Factory,
      color: "bg-red-500",
      services: 3
    },
    {
      id: "education",
      label: "Education & Compliance",
      icon: Upload,
      color: "bg-indigo-500",
      services: 3
    }
  ];

  const deductCredits = (amount: number, description: string) => {
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      
      const transaction = {
        id: Date.now(),
        type: 'debit',
        amount: amount,
        description: description,
        timestamp: new Date(),
        balance: newCredits
      };
      
      setTransactions([transaction, ...transactions]);
      return true;
    } else {
      return false;
    }
  };

  const addResult = (newResult) => {
    // Deduct 1 credit per API call
    if (deductCredits(1, `API Call: ${newResult.service}`)) {
      setResults(prev => [...prev, { ...newResult, id: Date.now(), timestamp: new Date() }]);
    }
  };

  const successRate = results.length > 0 ? (results.filter(r => r.status === 'SUCCESS').length / results.length * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* EKO Logo */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/cb6255c2-8a31-4856-b9b4-3aaf40ed7f92.png" 
                  alt="EKO Logo" 
                  className="h-10 w-auto"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-900">Eko Shield</span>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                Powered by EKO API
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Wallet Display with + button */}
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                <Wallet className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">{credits} Credits</span>
                <Link to="/payment">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-purple-200">
                    <Plus className="h-3 w-3 text-purple-600" />
                  </Button>
                </Link>
              </div>
              <Link to="/wallet">
                <Button size="sm" variant="outline">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet & History
                </Button>
              </Link>
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                API Connected
              </Badge>
              <Link to="/dashboard">
                <Button size="sm" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Full Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* API Configuration */}
        <div className="mb-8">
          <APIKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Verifications</p>
                <p className="text-2xl font-bold text-blue-900">{results.length}</p>
              </div>
              <Search className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-green-900">{successRate}%</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">API Services</p>
                <p className="text-2xl font-bold text-purple-900">22</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
            <Link to="/dashboard" className="flex items-center justify-between h-full group">
              <div>
                <p className="text-slate-600 text-sm font-medium">View Analytics</p>
                <p className="text-lg font-bold text-slate-900">Full Dashboard</p>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-500 group-hover:text-slate-700 transition-colors" />
            </Link>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Services</h3>
              <div className="space-y-3">
                {verificationCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        activeTab === category.id
                          ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                          : 'hover:bg-slate-50 border-2 border-transparent text-slate-700'
                      }`}
                    >
                      <div className={`p-2 rounded-md ${category.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{category.label}</p>
                        <p className="text-xs opacity-70">{category.services} services</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3 lg:grid-cols-7">
                  <TabsTrigger value="unified" className="text-xs">Multi-Service</TabsTrigger>
                  <TabsTrigger value="employment" className="text-xs">Employment</TabsTrigger>
                  <TabsTrigger value="gstin" className="text-xs">GSTIN</TabsTrigger>
                  <TabsTrigger value="vehicle" className="text-xs">Vehicle</TabsTrigger>
                  <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
                  <TabsTrigger value="healthcare" className="text-xs">Healthcare</TabsTrigger>
                  <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
                </TabsList>
                <BulkUpload onResults={addResult} apiKey={apiKey} />
              </div>

              <TabsContent value="unified" className="mt-0">
                <UnifiedVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>

              <TabsContent value="employment" className="mt-0">
                <EmploymentVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>

              <TabsContent value="gstin" className="mt-0">
                <GSTINVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>

              <TabsContent value="vehicle" className="mt-0">
                <VehicleVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>

              <TabsContent value="financial" className="mt-0">
                <FinancialVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>

              <TabsContent value="healthcare" className="mt-0">
                <HealthcareVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <EducationVerification apiKey={apiKey} onResult={addResult} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <ResultsManager results={results} setResults={setResults} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
