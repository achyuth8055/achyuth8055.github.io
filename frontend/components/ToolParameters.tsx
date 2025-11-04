/**
 * Dynamic Tool Parameters Component
 * Renders form inputs based on tool configuration
 */

import React, { useState, useEffect } from 'react';
import { ToolParameter } from '../toolConfig';

interface ToolParametersProps {
  parameters: ToolParameter[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

export default function ToolParameters({ parameters, values, onChange }: ToolParametersProps) {
  const [localValues, setLocalValues] = useState<Record<string, any>>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleChange = (name: string, value: any) => {
    const newValues = { ...localValues, [name]: value };
    setLocalValues(newValues);
    onChange(newValues);
  };

  const renderParameter = (param: ToolParameter) => {
    const currentValue = localValues[param.name] ?? param.defaultValue;

    switch (param.type) {
      case 'slider':
        return (
          <div key={param.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.label}
              {param.unit && <span className="text-gray-500 ml-1">({param.unit})</span>}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step || 1}
                value={currentValue}
                onChange={(e) => handleChange(param.name, parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-lg font-semibold text-gray-700 w-16 text-right">
                {currentValue}{param.unit}
              </span>
            </div>
            {param.description && (
              <p className="text-xs text-gray-500 mt-1">{param.description}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={param.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.label}
              {param.unit && <span className="text-gray-500 ml-1">({param.unit})</span>}
            </label>
            <input
              type="number"
              min={param.min}
              max={param.max}
              step={param.step || 1}
              value={currentValue}
              onChange={(e) => handleChange(param.name, parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={param.required}
            />
            {param.description && (
              <p className="text-xs text-gray-500 mt-1">{param.description}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={param.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.label}
            </label>
            <select
              value={currentValue}
              onChange={(e) => handleChange(param.name, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {param.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {param.description && (
              <p className="text-xs text-gray-500 mt-1">{param.description}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={param.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.label}
            </label>
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleChange(param.name, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={param.description}
              required={param.required}
            />
          </div>
        );

      case 'color':
        return (
          <div key={param.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentValue}
                onChange={(e) => handleChange(param.name, e.target.value)}
                className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleChange(param.name, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="#000000"
              />
            </div>
            {param.description && (
              <p className="text-xs text-gray-500 mt-1">{param.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Don't render if no parameters
  if (parameters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ⚙️ Customize Settings
      </h3>
      {parameters.map(param => renderParameter(param))}
    </div>
  );
}
