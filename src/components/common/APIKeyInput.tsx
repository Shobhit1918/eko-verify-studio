
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface APIKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ apiKey, setApiKey }) => {
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateAPIKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setIsValidating(true);
    
    // Simulate API key validation
    setTimeout(() => {
      setIsValid(true);
      setIsValidating(false);
      toast.success("API key validated successfully");
    }, 1500);
  };

  const handleSaveToLocalStorage = () => {
    if (apiKey.trim()) {
      localStorage.setItem('eko-api-key', apiKey);
      toast.success("API key saved to browser storage");
    }
  };

  React.useEffect(() => {
    const savedKey = localStorage.getItem('eko-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  }, [setApiKey]);

  return (
    <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Key className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Eko API Configuration</h3>
          <p className="text-sm text-slate-600">Enter your API key to access verification services</p>
        </div>
        {isValid && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="Enter your Eko API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <Button 
          onClick={validateAPIKey} 
          disabled={isValidating || !apiKey.trim()}
          variant={isValid ? "outline" : "default"}
        >
          {isValidating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </div>
          ) : isValid ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validated
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Validate
            </>
          )}
        </Button>

        <Button 
          onClick={handleSaveToLocalStorage}
          variant="outline"
          disabled={!apiKey.trim()}
        >
          Save
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Get your API key:</strong> Visit{' '}
          <a 
            href="https://developers.eko.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-blue-900"
          >
            developers.eko.in
          </a>{' '}
          to obtain your authentication credentials.
        </p>
      </div>
    </Card>
  );
};

export default APIKeyInput;
