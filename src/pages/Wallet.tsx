
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowLeft, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import WalletManager from "@/components/wallet/WalletManager";

const WalletPage = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(2500);
  const [transactions, setTransactions] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/cb6255c2-8a31-4856-b9b4-3aaf40ed7f92.png" 
                  alt="EKO Logo" 
                  className="h-10 w-auto"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-900">Eko Shield</span>
                  <span className="text-lg text-slate-600">- Wallet & History</span>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                Powered by EKO API
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                <Wallet className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">{credits} Credits</span>
              </div>
              <Link to="/payment">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <WalletManager 
          credits={credits} 
          setCredits={setCredits}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      </div>
    </div>
  );
};

export default WalletPage;
