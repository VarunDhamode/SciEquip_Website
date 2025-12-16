import React from 'react';
import { Microscope, ChevronRight } from 'lucide-react';

export default function EquipmentCard({ equipment, onConfigure }) {
    return (
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex-1 relative z-10">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Microscope className="text-indigo-600" size={28} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-2">{equipment.name}</h3>

                <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md mb-4 border border-slate-200">
                    {equipment.category}
                </span>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    {equipment.description || `Configurable ${equipment.category} with ${equipment.parameters.length} specialized parameters.`}
                </p>
            </div>

            <button
                onClick={() => onConfigure(equipment)}
                className="w-full py-3 bg-white border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white rounded-xl transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2 group-hover:shadow-md relative z-10"
            >
                Configure & Request <ChevronRight size={16} />
            </button>
        </div>
    );
}
