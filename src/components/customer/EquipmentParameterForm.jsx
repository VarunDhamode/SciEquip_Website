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
            budget: 0 // Default budget placeholder
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Configure Specification</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500">For:</span>
                            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{equipment.name}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {equipment.parameters.map((param, idx) => {
                            if (param.condition && !formData[param.condition.toLowerCase()]) return null;

                            return (
                                <div key={idx} className={param.type === 'textarea' ? 'col-span-1 md:col-span-2 space-y-2' : 'space-y-2'}>
                                    {param.type !== 'boolean' && (
                                        <label className="text-sm font-semibold text-slate-700 block">
                                            {param.name} {param.unit && <span className="text-slate-400 font-normal ml-1">({param.unit})</span>}
                                        </label>
                                    )}

                                    {param.type === 'select' ? (
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
                                            onChange={(e) => handleChange(param.name, e.target.value)}
                                            required={!param.name.includes('Optional')}
                                        >
                                            <option value="">Select {param.name}...</option>
                                            {param.options.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : param.type === 'boolean' ? (
                                        <div className="flex items-center space-x-3 pt-6">
                                            <input
                                                type="checkbox"
                                                id={`param-${idx}`}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                                onChange={(e) => handleChange(param.name, e.target.checked ? 'Yes' : 'No')}
                                            />
                                            <label htmlFor={`param-${idx}`} className="text-sm font-medium text-slate-700">
                                                {param.label || param.name}
                                            </label>
                                        </div>
                                    ) : param.type === 'textarea' ? (
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                            placeholder={param.placeholder || `Enter ${param.name}...`}
                                            onChange={(e) => handleChange(param.name, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type={param.type === 'number' ? 'number' : 'text'}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                            placeholder={param.placeholder || `Enter ${param.name}...`}
                                            step={param.type === 'number' ? 'any' : undefined}
                                            onChange={(e) => handleChange(param.name, e.target.value)}
                                            required={!param.name.includes('Optional')}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:translate-y-[-1px]"
                        >
                            Proceed to Create RFQ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
