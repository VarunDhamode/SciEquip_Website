import React, { useState } from 'react';
import { Cloud, FileUp, CheckCircle, Wand2, Sparkles, ArrowLeft } from 'lucide-react';
import { uploadFileToAzureBlob } from '../../api/azureBlob';
import { callGeminiSpecRefiner } from '../../api/geminiAI';
import { createRFQ } from '../../api/azureSQL';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateRFQForm = ({ onBack }) => {
    const { user } = useAuth();
    const [status, setStatus] = useState('idle');
    const [aiLoading, setAiLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '', category: 'Chiller', cooling_capacity: '', temp_min: '', temp_max: '', budget: '', description: ''
    });

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setStatus('uploading');
        try {
            await uploadFileToAzureBlob(file);
            setStatus('analyzing');
            // Simulation of analysis time
            setTimeout(() => setStatus('done'), 1500);
        } catch (err) {
            console.error(err);
            setStatus('idle');
            alert("Upload failed");
        }
    };

    const handleGeminiRefine = async () => {
        if (!formData.description) return alert("Please enter a rough description first!");
        setAiLoading(true);
        try {
            const refinedData = await callGeminiSpecRefiner(formData.description);
            if (refinedData) {
                setFormData(prev => ({ ...prev, ...refinedData }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.budget) {
            alert("Please fill in required fields (Title, Description, Budget)");
            return;
        }

        setSubmitting(true);
        try {
            await createRFQ({ ...formData, customerId: user.id });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ title: '', category: 'Chiller', cooling_capacity: '', temp_min: '', temp_max: '', budget: '', description: '' });
                setStatus('idle');
            }, 3000);
        } catch (error) {
            alert("Failed to create RFQ: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in zoom-in">
                <div className="bg-emerald-100 p-6 rounded-full mb-6 text-emerald-600 shadow-lg shadow-emerald-100">
                    <CheckCircle size={64} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">RFQ Posted Successfully!</h2>
                <p className="text-slate-500 text-lg max-w-md">Your requirement has been broadcast to our vendor network.</p>
                <button onClick={() => setSuccess(false)} className="mt-8 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Create Another RFQ</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: AI & Upload */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                        <div className="flex items-center gap-2 mb-4 opacity-90 relative z-10">
                            <Sparkles size={20} />
                            <span className="text-sm font-bold tracking-wide">AI ASSISTANT</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 relative z-10">Smart RFQ Creation</h3>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed relative z-10">
                            Upload your technical spec sheet and let our AI extract the requirements automatically.
                        </p>

                        <div className="relative z-10">
                            {status !== 'idle' && status !== 'done' && (
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
                                    <LoadingSpinner text={status === 'uploading' ? "Uploading..." : "Analyzing..."} />
                                </div>
                            )}

                            {status === 'idle' && (
                                <label className="block border-2 border-dashed border-white/30 rounded-xl p-6 text-center transition-all cursor-pointer hover:bg-white/10 hover:border-white/50 group">
                                    <Cloud className="mx-auto mb-3 opacity-80 group-hover:scale-110 transition-transform" size={32} />
                                    <span className="text-sm font-semibold block">Click to Upload PDF/Doc</span>
                                    <input type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx" />
                                </label>
                            )}

                            {status === 'done' && (
                                <div className="bg-emerald-500/20 border border-emerald-300/50 rounded-xl p-4 flex items-center gap-3">
                                    <CheckCircle className="text-emerald-300" size={24} />
                                    <div>
                                        <p className="font-bold text-sm text-emerald-100">Analysis Complete</p>
                                        <p className="text-xs text-emerald-200">Form auto-filled.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                            Quick Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0" /> Be specific about capacity.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0" /> Mention delivery timeline.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0" /> Specify certification needs.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Details</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
                                <input
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-slate-900 placeholder:font-normal"
                                    placeholder="e.g. Industrial Chiller for Main Plant"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Chiller</option>
                                        <option>Centrifuge</option>
                                        <option>Spectrometer</option>
                                        <option>Microscope</option>
                                        <option>Chromatography</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Budget Estimate ($)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="50000"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-slate-700">Detailed Description</label>
                                    <button
                                        onClick={handleGeminiRefine}
                                        disabled={aiLoading}
                                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                                    >
                                        {aiLoading ? "Thinking..." : <><Wand2 size={12} /> Refine with Gemini</>}
                                    </button>
                                </div>
                                <textarea
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-sm leading-relaxed"
                                    placeholder="Describe technical requirements, cooling capacity, constraints, etc..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Technical Specifications</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input placeholder="Cooling Capacity" className="p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.cooling_capacity} onChange={(e) => setFormData({ ...formData, cooling_capacity: e.target.value })} />
                                    <input placeholder="Min Temp" className="p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.temp_min} onChange={(e) => setFormData({ ...formData, temp_min: e.target.value })} />
                                    <input placeholder="Max Temp" className="p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.temp_max} onChange={(e) => setFormData({ ...formData, temp_max: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 text-lg disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {submitting ? 'Broadcasting...' : 'Submit Requirement'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRFQForm;
