import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Download, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface BulkUploadProps {
  onResults: (results: any[]) => void;
  apiKey: string;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onResults, apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verificationServices = [
    { id: 'bank-account', name: 'Bank Account Verification', category: 'Employment', template: 'account_number,ifsc_code,holder_name\n12345678901,SBIN0001234,John Doe\n' },
    { id: 'pan', name: 'PAN Verification', category: 'Employment', template: 'pan_number,holder_name\nABCDE1234F,John Doe\n' },
    { id: 'aadhaar', name: 'Aadhaar Verification', category: 'Employment', template: 'aadhaar_number,holder_name\n123456789012,John Doe\n' },
    { id: 'gstin', name: 'GSTIN Verification', category: 'GSTIN', template: 'gstin_number,business_name\n22AAAAA0000A1Z5,Sample Business\n' },
    { id: 'vehicle-rc', name: 'Vehicle RC Verification', category: 'Vehicle', template: 'registration_number,owner_name\nMH01AB1234,John Doe\n' },
    { id: 'driving-licence', name: 'Driving Licence Verification', category: 'Vehicle', template: 'licence_number,holder_name,date_of_birth\nMH0120200012345,John Doe,1990-01-01\n' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        toast.success(`File "${file.name}" uploaded successfully`);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const downloadTemplate = () => {
    if (!selectedService) {
      toast.error('Please select a verification service first');
      return;
    }

    const service = verificationServices.find(s => s.id === selectedService);
    const csvContent = service?.template || 'field1,field2,field3\nvalue1,value2,value3\n';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${service?.name.replace(/\s+/g, '_')}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Template downloaded for ${service?.name}`);
  };

  const processBulkVerification = async () => {
    if (!apiKey) {
      toast.error('Please configure your API key first');
      return;
    }

    if (!selectedService || !uploadedFile) {
      toast.error('Please select a service and upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);

    try {
      const text = await uploadedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      const dataRows = lines.slice(1);
      
      setTotalCount(dataRows.length);
      const results: any[] = [];

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i].split(',');
        const rowData: any = {};
        
        headers.forEach((header, index) => {
          rowData[header.trim()] = row[index]?.trim() || '';
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const service = verificationServices.find(s => s.id === selectedService);
        const result = {
          service: service?.name,
          category: service?.category,
          status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED',
          data: rowData,
          response: {
            verified: Math.random() > 0.1,
            confidence: Math.floor(Math.random() * 20) + 80,
            details: `Bulk ${service?.name} verification completed`,
            rowNumber: i + 2 // +2 because we skip header and arrays are 0-indexed
          }
        };

        results.push(result);
        setProcessedCount(i + 1);
        setProgress(((i + 1) / dataRows.length) * 100);
      }

      onResults(results);
      toast.success(`Bulk verification completed. Processed ${results.length} records.`);
      
      // Reset form
      setUploadedFile(null);
      setSelectedService('');
      setIsOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      toast.error('Error processing bulk verification');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProcessedCount(0);
      setTotalCount(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Bulk Upload</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Bulk Verification Upload</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Select Verification Service
            </label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a verification service" />
              </SelectTrigger>
              <SelectContent>
                {verificationServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{service.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Download */}
          {selectedService && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Download Template</p>
                  <p className="text-xs text-blue-700">Get the correct CSV format</p>
                </div>
                <Button size="sm" variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV Template
                </Button>
              </div>
            </Card>
          )}

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Upload CSV File
            </label>
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-600">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Click to upload CSV file</p>
                  <p className="text-xs text-slate-500">Max file size: 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <Card className="p-4 bg-slate-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing...</span>
                  <span className="text-sm text-slate-600">
                    {processedCount} / {totalCount}
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-slate-600">
                  Please wait while we process your verification requests.
                </p>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={processBulkVerification}
              disabled={!selectedService || !uploadedFile || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Start Verification
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs text-amber-800">
                  <strong>Important:</strong> Ensure your CSV file follows the template format exactly.
                  Each row will be processed as a separate verification request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUpload;
