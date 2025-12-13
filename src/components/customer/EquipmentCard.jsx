import React from 'react';
import { Microscope } from 'lucide-react';

export default function EquipmentCard({ equipment, onConfigure }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
            <div className="flex-1">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Microscope className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{equipment.name}</h3>
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full mb-3">
                    {equipment.category}
                </span>
                <p className="text-sm text-slate-500 mb-4">
                    {equipment.parameters.length} configurable parameters
                </p>
            </div>

            <button
                onClick={() => onConfigure(equipment)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
                Configure & Request
            </button>
        </div>
    );
}
