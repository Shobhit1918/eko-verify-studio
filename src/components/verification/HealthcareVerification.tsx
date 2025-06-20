
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, FileText } from "lucide-react";
import { toast } from "sonner";
import DragDropService from "@/components/common/DragDropService";
import { EkoApiService } from "@/services/ekoApiService";

interface HealthcareVerificationProps {
  apiKey: string;
  onResult: (result: any) => void;
}

const HealthcareVerification: React.FC<HealthcareVerificationProps> = ({ apiKey, onResult }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const verificationServices = [
    {
      id: 'medical-license',
      name: 'Medical License Verification',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Verify medical practitioner license and credentials',
      fields: ['license_number', 'doctor_name', 'specialization']
    },
    {
      id: 'insurance-verification',
      name: 'Insurance Policy Verification',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'Validate insurance policy details and coverage',
      fields: ['policy_number', 'insurer_name', 'policy_holder']
    },
    {
      id: 'pharmacy-license',
      name: 'Pharmacy License Verification',
      icon: FileText,
      color: 'bg-green-500',
      description: 'Verify pharmacy license and drug permit details',
      fields: ['license_number', 'pharmacy_name', 'permit_type']
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
      toast.error("Please select at least one healthcare verification service");
      return;
    }

    setIsLoading(true);
    const ekoService = new EkoApiService(apiKey);
    
    try {
      for (const serviceId of selectedServices) {
        const service = verificationServices.find(s => s.id === serviceId);
        const serviceData = formData[serviceId] || {};
        
        let apiResult;
        
        switch (serviceId) {
          case 'medical-license':
            apiResult = await ekoService.verifyMedicalLicense(
              serviceData.license_number,
              serviceData.doctor_name,
              serviceData.specialization
            );
            break;
          case 'insurance-verification':
            apiResult = await ekoService.verifyInsurancePolicy(
              serviceData.policy_number,
              serviceData.insurer_name,
              serviceData.policy_holder
            );
            break;
          case 'pharmacy-license':
            apiResult = await ekoService.verifyPharmacyLicense(
              serviceData.license_number,
              serviceData.pharmacy_name,
              serviceData.permit_type
            );
            break;
          default:
            continue;
        }
        
        if (apiResult) {
          const result = {
            service: service?.name,
            category: 'Healthcare & Insurance',
            status: apiResult.success ? 'SUCCESS' : 'FAILED',
            data: serviceData,
            response: apiResult.data,
            error: apiResult.error
          };
          
          onResult(result);
          
          if (apiResult.success) {
            toast.success(`${service?.name} verification completed successfully`);
          } else {
            toast.error(`${service?.name} verification failed: ${apiResult.error}`);
          }
        }
      }
      
      setSelectedServices([]);
      setFormData({});
      
    } catch (error) {
      console.error('Healthcare verification error:', error);
      toast.error("Healthcare verification failed. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Services */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Healthcare & Insurance Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h3 className="text-lg font-semibold text-slate-900">Configure Selected Services</h3>
            <Badge variant="secondary">{selectedServices.length} selected</Badge>
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
                          placeholder={`Enter ${field.replace('_', ' ')}`}
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
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Verify ${selectedServices.length} Service(s)`
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HealthcareVerification;
