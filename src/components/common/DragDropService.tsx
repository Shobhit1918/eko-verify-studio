
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Move, Plus, Check } from "lucide-react";

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  fields: string[];
}

interface DragDropServiceProps {
  service: Service;
  onDrop: (serviceId: string) => void;
  isSelected: boolean;
}

const DragDropService: React.FC<DragDropServiceProps> = ({ service, onDrop, isSelected }) => {
  const IconComponent = service.icon;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', service.id);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedServiceId = e.dataTransfer.getData('text/plain');
    if (draggedServiceId === service.id && !isSelected) {
      onDrop(service.id);
    }
  };

  const handleClick = () => {
    if (!isSelected) {
      onDrop(service.id);
    }
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
        isSelected 
          ? 'border-blue-300 bg-blue-50 shadow-md' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
      draggable={!isSelected}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${service.color}`}>
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 text-sm">{service.name}</h4>
            <p className="text-xs text-slate-600 mt-1">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isSelected ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Check className="h-3 w-3 mr-1" />
              Added
            </Badge>
          ) : (
            <>
              <Move className="h-4 w-4 text-slate-400" />
              <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={handleClick}>
                <Plus className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {service.fields.slice(0, 3).map((field) => (
          <Badge key={field} variant="outline" className="text-xs">
            {field.replace('_', ' ')}
          </Badge>
        ))}
        {service.fields.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{service.fields.length - 3} more
          </Badge>
        )}
      </div>
      
      {!isSelected && (
        <div className="mt-3 text-xs text-slate-500 flex items-center">
          <Move className="h-3 w-3 mr-1" />
          Drag to add or click to select
        </div>
      )}
    </Card>
  );
};

export default DragDropService;
