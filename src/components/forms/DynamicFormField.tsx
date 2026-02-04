'use client';

// ============================================
// Dynamic Form Field Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface FieldConfig {
    type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea';
    placeholder?: string;
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
}

interface DynamicFieldValue {
    id: string;
    value: string;
}

interface DynamicFormFieldProps {
    label: string;
    values: DynamicFieldValue[];
    onChange: (values: DynamicFieldValue[]) => void;
    fieldConfig: FieldConfig;
    maxFields?: number;
    minFields?: number;
    addButtonLabel?: string;
    error?: string;
    helper?: string;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
    label,
    values,
    onChange,
    fieldConfig,
    maxFields = 10,
    minFields = 0,
    addButtonLabel = 'Add Field',
    error,
    helper,
}) => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleAdd = () => {
        if (values.length < maxFields) {
            onChange([...values, { id: generateId(), value: '' }]);
        }
    };

    const handleRemove = (id: string) => {
        if (values.length > minFields) {
            onChange(values.filter((v) => v.id !== id));
        }
    };

    const handleChange = (id: string, newValue: string) => {
        onChange(
            values.map((v) => (v.id === id ? { ...v, value: newValue } : v))
        );
    };

    const renderField = (field: DynamicFieldValue, index: number) => {
        const commonProps = {
            value: field.value,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                handleChange(field.id, e.target.value),
            placeholder: fieldConfig.placeholder,
        };

        if (fieldConfig.type === 'select' && fieldConfig.options) {
            return (
                <select
                    {...commonProps}
                    className="w-full px-4 py-3 text-sm border rounded-lg bg-white transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                >
                    <option value="">Select...</option>
                    {fieldConfig.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (fieldConfig.type === 'textarea') {
            return (
                <textarea
                    {...commonProps}
                    rows={3}
                    className="w-full px-4 py-3 text-sm border rounded-lg bg-white transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
            );
        }

        return (
            <input
                type={fieldConfig.type}
                {...commonProps}
                min={fieldConfig.min}
                max={fieldConfig.max}
                className="w-full px-4 py-3 text-sm border rounded-lg bg-white transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
        );
    };

    return (
        <div className="form-group">
            <label className="form-label">{label}</label>

            <div className="space-y-3">
                {values.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 animate-fadeIn">
                        <div className="flex-1">{renderField(field, index)}</div>
                        {values.length > minFields && (
                            <button
                                type="button"
                                onClick={() => handleRemove(field.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove field"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {values.length < maxFields && (
                <button
                    type="button"
                    onClick={handleAdd}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    {addButtonLabel}
                </button>
            )}

            {error && <p className="form-error mt-2">{error}</p>}
            {helper && !error && <p className="form-helper mt-2">{helper}</p>}
        </div>
    );
};

export default DynamicFormField;
