
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileCheck } from "lucide-react";
import { toast } from "sonner";
import DragDropService from "@/components/common/DragDropService";

interface GSTINVerificationProps {
  apiKey: string;
  onResult: (result: any) => void;
}

const GSTINVerification: React.FC<GSTINVerificationProps> = ({ apiKey, onResult }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const verificationServices = [
    {
      id: 'gstin',
      name: 'GSTIN Verification',
      icon: FileCheck,
      color: 'bg-green-500',
      description: 'Verify GST identification number and business details',
      fields: ['gstin_number', 'business_name']
    }
  ];

  const handleServiceDrop = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices([...selectedServices, serviceId]);
      toast.success(`${verificationServices.find(s => s.id === serviceId)?.name} added to verification workflow`);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(id => id !== serviceId));
    const newFormData = { ...formData };
    delete newFormData[serviceId];
    setFormData(newFormData);
  };

  const handleInputChange = (serviceId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [serviceId]: {
        ...formData[serviceId],
        [field]: value
      }
    });
  };

  const performVerification = async () => {
    if (!apiKey) {
      toast.error("Please configure your API key first");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please select GSTIN verification service");
      return;
    }

    setIsLoading(true);
    
    try {
      const service = verificationServices[0];
      const serviceData = formData[service.id] || {};
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        service: service.name,
        category: 'GSTIN Verification',
        status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED',
        data: serviceData,
        response: {
          verified: Math.random() > 0.1,
          confidence: Math.floor(Math.random() * 15) + 85,
          details: 'GSTIN verification completed with business details',
          businessInfo: {
            legalName: serviceData.business_name || 'Sample Business Name',
            tradeName: 'Sample Trade Name',
            registrationDate: '2020-01-15',
            status: 'Active',
            natureOfBusiness: 'Manufacturing'
          }
        }
      };
      
      onResult(mockResult);
      toast.success("GSTIN verification completed successfully");
      setSelectedServices([]);
      setFormData({});
      
    } catch (error) {
      toast.error("GSTIN verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Services */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">GSTIN Verification Service</h3>
        <div className="grid grid-cols-1">
          {verificationServices.map((service) => (
            <DragDropService
              key={service.id}
              service={service}
              onDrop={handleServiceDrop}
              isSelected={selectedServices.includes(service.id)}
            />
          ))}
        </div>
      </Card>

      {/* Selected Services Configuration */}
      {selectedServices.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Configure GSTIN Verification</h3>
            <Badge variant="secondary">1 selected</Badge>
          </div>
          
          <div className="space-y-6">
            {selectedServices.map((serviceId) => {
              const service = verificationServices.find(s => s.id === serviceId);
              if (!service) return null;

              const IconComponent = service.icon;
              
              return (
                <div key={serviceId} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${service.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{service.name}</h4>
                        <p className="text-sm text-slate-600">{service.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeService(serviceId)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.fields.map((field) => (
                      <div key={field}>
                        <Label className="text-sm font-medium capitalize">
                          {field.replace('_', ' ')}
                        </Label>
                        <Input
                          placeholder={field === 'gstin_number' ? 'e.g., 22AAAAA0000A1Z5' : `Enter ${field.replace('_', ' ')}`}
                          value={formData[serviceId]?.[field] || ''}
                          onChange={(e) => handleInputChange(serviceId, field, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={performVerification} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying GSTIN...
                </div>
              ) : (
                'Verify GSTIN'
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GSTINVerification;
