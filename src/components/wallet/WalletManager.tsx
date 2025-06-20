
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, Minus, CreditCard, History, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

interface WalletManagerProps {
  credits: number;
  setCredits: (credits: number) => void;
  transactions: any[];
  setTransactions: (transactions: any[]) => void;
}

const WalletManager: React.FC<WalletManagerProps> = ({ 
  credits, 
  setCredits, 
  transactions, 
  setTransactions 
}) => {
  const [topUpAmount, setTopUpAmount] = useState('');

  const addCredits = () => {
    const amount = parseInt(topUpAmount);
    if (amount && amount > 0) {
      const newCredits = credits + amount;
      setCredits(newCredits);
      
      const transaction = {
        id: Date.now(),
        type: 'credit',
        amount: amount,
        description: 'Credits added to wallet',
        timestamp: new Date(),
        balance: newCredits
      };
      
      setTransactions([transaction, ...transactions]);
      setTopUpAmount('');
      toast.success(`₹${amount} credits added to your wallet`);
    }
  };

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
      toast.error('Insufficient credits in wallet');
      return false;
    }
  };

  const getCreditStatus = () => {
    if (credits > 1000) return { color: 'bg-green-500', text: 'Healthy' };
    if (credits > 500) return { color: 'bg-yellow-500', text: 'Medium' };
    return { color: 'bg-red-500', text: 'Low' };
  };

  const status = getCreditStatus();

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900">Wallet Balance</h3>
              <p className="text-purple-600">Available credits for API calls</p>
            </div>
          </div>
          <Badge className={`${status.color} text-white`}>
            {status.text}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-purple-900">{credits.toLocaleString()}</p>
            <p className="text-sm text-purple-600">Credits (₹{(credits * 0.5).toFixed(2)} value)</p>
          </div>
          
          {credits < 100 && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Low Balance Alert</span>
            </div>
          )}
        </div>
      </Card>

      {/* Add Credits */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Credits</h3>
        <div className="flex space-x-3">
          <Input
            type="number"
            placeholder="Enter amount"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addCredits} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Credits
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[100, 500, 1000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={() => setTopUpAmount(amount.toString())}
              className="text-sm"
            >
              +{amount} Credits
            </Button>
          ))}
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <History className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Transaction History</h3>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No transactions yet</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <Plus className="h-4 w-4 text-green-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{transaction.description}</p>
                    <p className="text-sm text-slate-500">
                      {transaction.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                  </p>
                  <p className="text-sm text-slate-500">Balance: {transaction.balance}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default WalletManager;
