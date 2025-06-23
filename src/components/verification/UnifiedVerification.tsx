
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Building2, Car, Factory, FileCheck, Shield, Upload, GraduationCap, Award, CreditCard, Heart, Truck, Users } from "lucide-react";
import { toast } from "sonner";
import DragDropService from "@/components/common/DragDropService";
import EmploymentVerification from "./EmploymentVerification";
import GSTINVerification from "./GSTINVerification";
import VehicleVerification from "./VehicleVerification";
import FinancialVerification from "./FinancialVerification";
import HealthcareVerification from "./HealthcareVerification";
import EducationVerification from "./EducationVerification";

interface UnifiedVerificationProps {
  apiKey: string;
  onResult: (result: any) => void;
}

const UnifiedVerification: React.FC<UnifiedVerificationProps> = ({ apiKey, onResult }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const categories = [
    { id: "all", label: "All Services", icon: Shield },
    { id: "employment", label: "Employment", icon: Building2 },
    { id: "gstin", label: "GSTIN", icon: FileCheck },
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "financial", label: "Financial", icon: CreditCard },
    { id: "healthcare", label: "Healthcare", icon: Heart },
    { id: "education", label: "Education", icon: GraduationCap }
  ];

  const allServices = [
    // Employment Services
    { id: 'pan', name: 'PAN Verification', icon: FileCheck, color: 'bg-blue-500', category: 'employment', description: 'Verify PAN card details', fields: ['pan_number', 'holder_name'] },
    { id: 'aadhaar', name: 'Aadhaar Verification', icon: Users, color: 'bg-green-500', category: 'employment', description: 'Verify Aadhaar card details', fields: ['aadhaar_number', 'holder_name'] },
    { id: 'bank-account', name: 'Bank Account Verification', icon: CreditCard, color: 'bg-purple-500', category: 'employment', description: 'Verify bank account details', fields: ['account_number', 'ifsc_code', 'holder_name'] },
    
    // GSTIN Services
    { id: 'gstin', name: 'GSTIN Verification', icon: Factory, color: 'bg-green-600', category: 'gstin', description: 'Verify GSTIN registration', fields: ['gstin_number', 'business_name'] },
    
    // Vehicle Services
    { id: 'vehicle-rc', name: 'Vehicle RC Verification', icon: Car, color: 'bg-orange-500', category: 'vehicle', description: 'Verify vehicle registration certificate', fields: ['registration_number', 'owner_name'] },
    { id: 'driving-licence', name: 'Driving Licence Verification', icon: Truck, color: 'bg-red-500', category: 'vehicle', description: 'Verify driving licence details', fields: ['licence_number', 'holder_name', 'date_of_birth'] },
    
    // Financial Services
    { id: 'credit-score', name: 'Credit Score Check', icon: Shield, color: 'bg-indigo-500', category: 'financial', description: 'Check credit score and history', fields: ['pan_number', 'holder_name', 'date_of_birth'] },
    { id: 'loan-eligibility', name: 'Loan Eligibility Check', icon: CreditCard, color: 'bg-teal-500', category: 'financial', description: 'Check loan eligibility', fields: ['pan_number', 'annual_income', 'employment_type'] },
    
    // Healthcare Services
    { id: 'medical-license', name: 'Medical License Verification', icon: Heart, color: 'bg-pink-500', category: 'healthcare', description: 'Verify medical practitioner license', fields: ['license_number', 'doctor_name', 'specialization'] },
    { id: 'insurance-policy', name: 'Insurance Policy Verification', icon: Shield, color: 'bg-cyan-500', category: 'healthcare', description: 'Verify insurance policy details', fields: ['policy_number', 'holder_name', 'provider_name'] },
    
    // Education Services
    { id: 'degree-verification', name: 'Degree Verification', icon: GraduationCap, color: 'bg-indigo-500', category: 'education', description: 'Verify educational degrees', fields: ['degree_number', 'university_name', 'student_name'] },
    { id: 'professional-certification', name: 'Professional Certification', icon: Award, color: 'bg-purple-500', category: 'education', description: 'Verify professional certifications', fields: ['certificate_number', 'certifying_body', 'certificate_holder'] }
  ];

  const filteredServices = selectedCategory === "all" 
    ? allServices 
    : allServices.filter(service => service.category === selectedCategory);

  const handleServiceSelect = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices([...selectedServices, serviceId]);
      const service = allServices.find(s => s.id === serviceId);
      toast.success(`${service?.name} added to verification workflow`);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(id => id !== serviceId));
  };

  const clearAllServices = () => {
    setSelectedServices([]);
    toast.success("All services cleared");
  };

  const getCategoryComponent = (categoryId: string) => {
    switch (categoryId) {
      case 'employment':
        return <EmploymentVerification apiKey={apiKey} onResult={onResult} />;
      case 'gstin':
        return <GSTINVerification apiKey={apiKey} onResult={onResult} />;
      case 'vehicle':
        return <VehicleVerification apiKey={apiKey} onResult={onResult} />;
      case 'financial':
        return <FinancialVerification apiKey={apiKey} onResult={onResult} />;
      case 'healthcare':
        return <HealthcareVerification apiKey={apiKey} onResult={onResult} />;
      case 'education':
        return <EducationVerification apiKey={apiKey} onResult={onResult} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Verification Categories</h3>
        <ToggleGroup type="single" value={selectedCategory} onValueChange={setSelectedCategory}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <ToggleGroupItem key={category.id} value={category.id} className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span>{category.label}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </Card>

      {/* Show all services grid for "all" category, otherwise show category-specific services */}
      {selectedCategory === "all" ? (
        <>
          {/* All Services Grid */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">All Available APIs</h3>
              <Badge variant="outline">{allServices.length} services</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map((service) => (
                <DragDropService
                  key={service.id}
                  service={service}
                  onDrop={handleServiceSelect}
                  isSelected={selectedServices.includes(service.id)}
                />
              ))}
            </div>
          </Card>

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Services</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{selectedServices.length} selected</Badge>
                  <Button size="sm" variant="outline" onClick={clearAllServices}>
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((serviceId) => {
                  const service = allServices.find(s => s.id === serviceId);
                  if (!service) return null;
                  const IconComponent = service.icon;
                  
                  return (
                    <div key={serviceId} className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                      <div className={`p-1 rounded ${service.color}`}>
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{service.name}</span>
                      <Badge variant="outline" className="text-xs">{service.category}</Badge>
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
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Category-specific services */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {categories.find(c => c.id === selectedCategory)?.label} Services
              </h3>
              <Badge variant="outline">{filteredServices.length} services</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <DragDropService
                  key={service.id}
                  service={service}
                  onDrop={handleServiceSelect}
                  isSelected={selectedServices.includes(service.id)}
                />
              ))}
            </div>
          </Card>

          {/* Category-specific verification component */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {categories.find(c => c.id === selectedCategory)?.label} Verification
            </h3>
            {getCategoryComponent(selectedCategory)}
          </Card>
        </>
      )}
    </div>
  );
};

export default UnifiedVerification;
