
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, CreditCard, User, Phone, FileText, Users, MapPin, Car, IdCard } from "lucide-react";
import { toast } from "sonner";
import DragDropService from "@/components/common/DragDropService";
import { EkoApiService } from "@/services/ekoApiService";

interface EmploymentVerificationProps {
  apiKey: string;
  onResult: (result: any) => void;
}

const EmploymentVerification: React.FC<EmploymentVerificationProps> = ({ apiKey, onResult }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const verificationServices = [
    {
      id: 'bank-account',
      name: 'Bank Account Verification',
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Verify bank account details and ownership',
      fields: ['account_number', 'ifsc_code', 'name']
    },
    {
      id: 'pan',
      name: 'PAN Verification',
      icon: CreditCard,
      color: 'bg-green-500',
      description: 'Validate PAN card details and status',
      fields: ['pan_number', 'name']
    },
    {
      id: 'aadhaar',
      name: 'Aadhaar Verification',
      icon: User,
      color: 'bg-purple-500',
      description: 'Verify Aadhaar details and demographics',
      fields: ['aadhaar_number', 'name']
    },
    {
      id: 'mobile-otp',
      name: 'Mobile OTP',
      icon: Phone,
      color: 'bg-orange-500',
      description: 'Mobile number verification via OTP',
      fields: ['mobile_number']
    },
    {
      id: 'digilocker',
      name: 'Digilocker',
      icon: FileText,
      color: 'bg-indigo-500',
      description: 'Access documents from Digilocker',
      fields: ['digilocker_id']
    },
    {
      id: 'voter-id',
      name: 'Voter ID',
      icon: Users,
      color: 'bg-red-500',
      description: 'Verify voter ID card details',
      fields: ['voter_id', 'name']
    },
    {
      id: 'passport',
      name: 'Passport',
      icon: MapPin,
      color: 'bg-teal-500',
      description: 'Passport verification and validation',
      fields: ['passport_number', 'name']
    },
    {
      id: 'employee-details',
      name: 'Employee Details',
      icon: Building2,
      color: 'bg-cyan-500',
      description: 'Verify employment and salary details',
      fields: ['employee_id', 'company_name']
    },
    {
      id: 'name-match',
      name: 'Name Match',
      icon: IdCard,
      color: 'bg-pink-500',
      description: 'Cross-verify names across documents',
      fields: ['name1', 'name2']
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
      toast.error("Please select at least one verification service");
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
          case 'bank-account':
            apiResult = await ekoService.verifyBankAccount(
              serviceData.account_number,
              serviceData.ifsc_code,
              serviceData.name
            );
            break;
          case 'pan':
            apiResult = await ekoService.verifyPAN(
              serviceData.pan_number,
              serviceData.name
            );
            break;
          case 'aadhaar':
            apiResult = await ekoService.verifyAadhaar(
              serviceData.aadhaar_number,
              serviceData.name
            );
            break;
          case 'mobile-otp':
            apiResult = await ekoService.sendMobileOTP(serviceData.mobile_number);
            break;
          case 'digilocker':
            apiResult = await ekoService.accessDigilocker(serviceData.digilocker_id);
            break;
          case 'voter-id':
            apiResult = await ekoService.verifyVoterID(
              serviceData.voter_id,
              serviceData.name
            );
            break;
          case 'passport':
            apiResult = await ekoService.verifyPassport(
              serviceData.passport_number,
              serviceData.name
            );
            break;
          case 'employee-details':
            apiResult = await ekoService.verifyEmployeeDetails(
              serviceData.employee_id,
              serviceData.company_name
            );
            break;
          case 'name-match':
            apiResult = await ekoService.nameMatch(
              serviceData.name1,
              serviceData.name2
            );
            break;
          default:
            continue;
        }
        
        const result = {
          service: service?.name,
          category: 'Employment Verification',
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
      
      setSelectedServices([]);
      setFormData({});
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error("Verification failed. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Services */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Employment Verification Services</h3>
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
            {selectedServices.map((serviceId, index) => {
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
                  
                  {index < selectedServices.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={performVerification} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
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

export default EmploymentVerification;
