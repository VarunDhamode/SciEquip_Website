import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function EquipmentParameterForm({ equipment, onClose, onSubmit }) {
    const [formData, setFormData] = useState({});

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Construct description from parameters
        let description = `Equipment: ${equipment.name}\n\nSpecifications:\n`;
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                const param = equipment.parameters.find(p => p.name === key);
                const unit = param?.unit ? ` ${param.unit}` : '';
                description += `- ${key}: ${value}${unit}\n`;
            }
        });

        onSubmit({
            title: `RFQ for ${equipment.name}`,
            category: equipment.category,
            description: description,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Configure {equipment.name}</h2>
                        <p className="text-sm text-slate-500">Fill in the required specifications</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {equipment.parameters.map((param, idx) => {
                            // Specialized rendering based on type
                            if (param.condition && !formData[param.condition.toLowerCase()]) return null;

                            if (param.type === 'select') {
                                return (
                                    <div key={idx} className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">{param.name}</label>
                                        <select
                                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            onChange={(e) => handleChange(param.name, e.target.value)}
                                            required={!param.name.includes('Optional')}
                                        >
                                            <option value="">Select {param.name}</option>
                                            {param.options.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }

                            if (param.type === 'boolean') {
                                return (
                                    <div key={idx} className="flex items-center space-x-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id={`param-${idx}`}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                            onChange={(e) => handleChange(param.name, e.target.checked ? 'Yes' : 'No')}
                                        />
                                        <label htmlFor={`param-${idx}`} className="text-sm font-medium text-slate-700">
                                            {param.label || param.name}
                                        </label>
                                    </div>
                                );
                            }

                            if (param.type === 'textarea') {
                                return (
                                    <div key={idx} className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">{param.name}</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder={param.placeholder || `Enter ${param.name}...`}
                                            onChange={(e) => handleChange(param.name, e.target.value)}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        {param.name} {param.unit && <span className="text-slate-400">({param.unit})</span>}
                                    </label>
                                    <input
                                        type={param.type === 'number' ? 'number' : 'text'}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder={param.placeholder || `Enter ${param.name}`}
                                        step={param.type === 'number' ? 'any' : undefined}
                                        onChange={(e) => handleChange(param.name, e.target.value)}
                                        required={!param.name.includes('Optional')}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-200"
                        >
                            Proceed to Create RFQ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
