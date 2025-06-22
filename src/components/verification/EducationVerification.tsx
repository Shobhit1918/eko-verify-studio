
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, FileCheck } from "lucide-react";
import { toast } from "sonner";
import DragDropService from "@/components/common/DragDropService";
import { EkoApiService } from "@/services/ekoApiService";

interface EducationVerificationProps {
  apiKey: string;
  onResult: (result: any) => void;
}

const EducationVerification: React.FC<EducationVerificationProps> = ({ apiKey, onResult }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const verificationServices = [
    {
      id: 'degree-verification',
      name: 'Degree Verification',
      icon: GraduationCap,
      color: 'bg-indigo-500',
      description: 'Verify educational degrees and certificates',
      fields: ['degree_number', 'university_name', 'student_name', 'graduation_year']
    },
    {
      id: 'professional-certification',
      name: 'Professional Certification',
      icon: Award,
      color: 'bg-purple-500',
      description: 'Validate professional certifications and skills',
      fields: ['certificate_number', 'certifying_body', 'certificate_holder']
    },
    {
      id: 'regulatory-compliance',
      name: 'Regulatory Compliance Check',
      icon: FileCheck,
      color: 'bg-green-500',
      description: 'Verify regulatory compliance and licenses',
      fields: ['license_number', 'regulatory_body', 'license_holder', 'license_type']
    }
  ];

  // Create a mapping of common field names
  const fieldMappings: Record<string, string[]> = {
    'holder_name': ['student_name', 'certificate_holder', 'license_holder'],
    'institution_name': ['university_name', 'certifying_body', 'regulatory_body']
  };

  // Get unique fields from selected services with deduplication
  const uniqueFields = useMemo(() => {
    const fieldsMap = new Map<string, { originalFields: string[], label: string }>();

    selectedServices.forEach(serviceId => {
      const service = verificationServices.find(s => s.id === serviceId);
      if (service) {
        service.fields.forEach(field => {
          // Check if this field should be mapped to a common field
          let commonFieldName = field;
          for (const [commonField, variants] of Object.entries(fieldMappings)) {
            if (variants.includes(field)) {
              commonFieldName = commonField;
              break;
            }
          }

          if (!fieldsMap.has(commonFieldName)) {
            fieldsMap.set(commonFieldName, {
              originalFields: [],
              label: commonFieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
            });
          }
          
          const fieldInfo = fieldsMap.get(commonFieldName)!;
          if (!fieldInfo.originalFields.includes(field)) {
            fieldInfo.originalFields.push(field);
          }
        });
      }
    });

    return Array.from(fieldsMap.entries()).map(([name, info]) => ({
      name,
      originalFields: info.originalFields,
      label: info.label
    }));
  }, [selectedServices]);

  const handleServiceDrop = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices([...selectedServices, serviceId]);
      toast.success(`${verificationServices.find(s => s.id === serviceId)?.name} added to verification workflow`);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(id => id !== serviceId));
    // Clean up form data if no services need this field
    const remainingServices = selectedServices.filter(id => id !== serviceId);
    const stillNeededFields = new Set<string>();
    
    remainingServices.forEach(id => {
      const service = verificationServices.find(s => s.id === id);
      if (service) {
        service.fields.forEach(field => stillNeededFields.add(field));
      }
    });

    const newFormData = { ...formData };
    Object.keys(newFormData).forEach(field => {
      if (!stillNeededFields.has(field)) {
        delete newFormData[field];
      }
    });
    setFormData(newFormData);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const performVerification = async () => {
    if (!apiKey) {
      toast.error("Please configure your API key first");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please select at least one education verification service");
      return;
    }

    setIsLoading(true);
    const ekoService = new EkoApiService(apiKey);
    
    try {
      for (const serviceId of selectedServices) {
        const service = verificationServices.find(s => s.id === serviceId);
        if (!service) continue;

        // Map common fields back to service-specific field names
        const serviceData: Record<string, string> = {};
        service.fields.forEach(field => {
          // Check if this field has a common mapping
          let valueField = field;
          for (const [commonField, variants] of Object.entries(fieldMappings)) {
            if (variants.includes(field)) {
              valueField = commonField;
              break;
            }
          }
          serviceData[field] = formData[valueField] || formData[field] || '';
        });
        
        let apiResult;
        
        switch (serviceId) {
          case 'degree-verification':
            apiResult = await ekoService.verifyDegree(
              serviceData['degree_number'],
              serviceData['university_name'],
              serviceData['student_name'],
              serviceData['graduation_year']
            );
            break;
          case 'professional-certification':
            apiResult = await ekoService.verifyProfessionalCertification(
              serviceData['certificate_number'],
              serviceData['certifying_body'],
              serviceData['certificate_holder']
            );
            break;
          case 'regulatory-compliance':
            apiResult = await ekoService.checkRegulatoryCompliance(
              serviceData['license_number'],
              serviceData['regulatory_body'],
              serviceData['license_holder'],
              serviceData['license_type']
            );
            break;
          default:
            continue;
        }
        
        if (apiResult) {
          const result = {
            service: service.name,
            category: 'Education & Compliance',
            status: apiResult.success ? 'SUCCESS' : 'FAILED',
            data: serviceData,
            response: apiResult.data,
            error: apiResult.error
          };
          
          onResult(result);
          
          if (apiResult.success) {
            toast.success(`${service.name} verification completed successfully`);
          } else {
            toast.error(`${service.name} verification failed: ${apiResult.error}`);
          }
        }
      }
      
      setSelectedServices([]);
      setFormData({});
      
    } catch (error) {
      console.error('Education verification error:', error);
      toast.error("Education verification failed. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Services */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Education & Compliance Verification</h3>
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

      {/* Selected Services Display */}
      {selectedServices.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Selected Services</h3>
            <Badge variant="secondary">{selectedServices.length} selected</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedServices.map((serviceId) => {
              const service = verificationServices.find(s => s.id === serviceId);
              if (!service) return null;
              const IconComponent = service.icon;
              
              return (
                <div key={serviceId} className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                  <div className={`p-1 rounded ${service.color}`}>
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">{service.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeService(serviceId)}
                    className="h-5 w-5 p-0 hover:bg-slate-200"
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Unified Form Fields */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Enter Verification Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uniqueFields.map((field) => (
                <div key={field.name}>
                  <Label className="text-sm font-medium">
                    {field.label}
                    <span className="text-xs text-slate-500 ml-1">
                      (used by {field.originalFields.length} service{field.originalFields.length > 1 ? 's' : ''})
                    </span>
                  </Label>
                  <Input
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="mt-1"
                    type={field.name === 'graduation_year' ? 'number' : 'text'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={performVerification} 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
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

export default EducationVerification;
