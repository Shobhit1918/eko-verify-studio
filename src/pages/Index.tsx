import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Building2, Car, Factory, FileCheck, Download, Upload, Search, BarChart3, Wallet } from "lucide-react";
import EmploymentVerification from "@/components/verification/EmploymentVerification";
import GSTINVerification from "@/components/verification/GSTINVerification";
import VehicleVerification from "@/components/verification/VehicleVerification";
import FinancialVerification from "@/components/verification/FinancialVerification";
import HealthcareVerification from "@/components/verification/HealthcareVerification";
import EducationVerification from "@/components/verification/EducationVerification";
import APIKeyInput from "@/components/common/APIKeyInput";
import BulkUpload from "@/components/common/BulkUpload";
import ResultsManager from "@/components/common/ResultsManager";
import Dashboard from "@/components/dashboard/Dashboard";
import WalletManager from "@/components/wallet/WalletManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apiKey, setApiKey] = useState("");
  const [results, setResults] = useState([]);
  const [credits, setCredits] = useState(2500); // Initial credits
  const [transactions, setTransactions] = useState([]);

  const verificationCategories = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* EKO Logo */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    EKO
                  </span>
                  <span className="text-2xl font-bold text-slate-900">Verify Studio</span>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                Powered by EKO API
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Wallet Display */}
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                <Wallet className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">{credits} Credits</span>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                API Connected
              </Badge>
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

        {/* Stats Overview */}
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
                <p className="text-2xl font-bold text-green-900">98.5%</p>
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
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-orange-900">1.2s</p>
              </div>
              <Upload className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Navigation</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    activeTab === "dashboard"
                      ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                      : 'hover:bg-slate-50 border-2 border-transparent text-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-md bg-blue-500">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Dashboard</p>
                    <p className="text-xs opacity-70">Analytics & Overview</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("wallet")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    activeTab === "wallet"
                      ? 'bg-purple-50 border-2 border-purple-200 text-purple-900'
                      : 'hover:bg-slate-50 border-2 border-transparent text-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-md bg-purple-500">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Wallet</p>
                    <p className="text-xs opacity-70">Manage Credits</p>
                  </div>
                </button>

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
                <TabsList className="grid w-full max-w-md grid-cols-3 lg:grid-cols-6">
                  <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
                  <TabsTrigger value="wallet" className="text-xs">Wallet</TabsTrigger>
                  <TabsTrigger value="employment" className="text-xs">Employment</TabsTrigger>
                  <TabsTrigger value="gstin" className="text-xs">GSTIN</TabsTrigger>
                  <TabsTrigger value="vehicle" className="text-xs">Vehicle</TabsTrigger>
                  <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
                  <TabsTrigger value="healthcare" className="text-xs">Healthcare</TabsTrigger>
                  <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
                </TabsList>
                <BulkUpload onResults={addResult} apiKey={apiKey} />
              </div>

              <TabsContent value="dashboard" className="mt-0">
                <Dashboard results={results} credits={credits} />
              </TabsContent>

              <TabsContent value="wallet" className="mt-0">
                <WalletManager 
                  credits={credits} 
                  setCredits={setCredits}
                  transactions={transactions}
                  setTransactions={setTransactions}
                />
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
