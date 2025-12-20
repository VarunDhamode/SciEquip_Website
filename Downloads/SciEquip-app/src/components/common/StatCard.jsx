import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600',
        indigo: 'from-indigo-500 to-indigo-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                        <Icon className="text-white" size={28} />
                    </div>
                )}
            </div>
        </div>
    );
}
