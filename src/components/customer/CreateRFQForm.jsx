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
        await uploadFileToAzureBlob(file);
        // In real app, we would trigger Azure Function here
        setStatus('analyzing');
        setTimeout(() => setStatus('done'), 1500);
    };

    const handleGeminiRefine = async () => {
        if (!formData.description) return alert("Please enter a rough description first!");
        setAiLoading(true);
        const refinedData = await callGeminiSpecRefiner(formData.description);
        if (refinedData) {
            setFormData(prev => ({ ...prev, ...refinedData }));
        }
        setAiLoading(false);
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
            // Reset form after delay or redirect
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
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4 text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">RFQ Created Successfully!</h2>
                <p className="text-slate-500">Your requirement has been posted to vendors.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-blue-600 hover:underline">Create Another</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Create New Requirement</h2>
                <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">Azure + Gemini</span>
            </div>

            {/* Upload Section */}
            <div className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center relative overflow-hidden transition-colors ${status === 'idle' ? 'border-slate-300 bg-slate-50' : 'border-blue-400 bg-blue-50'}`}>
                {status !== 'idle' && status !== 'done' && <LoadingSpinner text={status === 'uploading' ? "Uploading..." : "Analyzing..."} />}

                {status === 'done' && (
                    <div className="absolute top-4 right-4 text-green-600 flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm text-xs font-bold">
                        <CheckCircle size={14} /> Analyzed
                    </div>
                )}

                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-full mb-4 shadow-sm"><FileUp size={32} className="text-slate-400" /></div>
                    <h3 className="text-lg font-semibold text-slate-700">Upload Spec Document</h3>
                    <label className="bg-slate-900 text-white px-6 py-2 rounded-lg cursor-pointer mt-4 flex items-center gap-2 hover:bg-slate-800 transition-colors">
                        <Cloud size={16} /> Upload to Azure
                        <input type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx" />
                    </label>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded text-sm font-semibold"
                            placeholder="e.g., High-Performance Liquid Chromatograph"
                        />
                    </div>

                    <div className="col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Description</label>
                            <button onClick={handleGeminiRefine} disabled={aiLoading} className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-200 hover:bg-purple-100 transition-colors">
                                {aiLoading ? "Thinking..." : <><Sparkles size={12} /> Refine with Gemini</>}
                            </button>
                        </div>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-slate-300 rounded h-24 text-sm" placeholder="Describe your needs..." />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select className="w-full p-2 border border-slate-300 rounded" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option>Chiller</option>
                            <option>Centrifuge</option>
                            <option>Spectrometer</option>
                            <option>Microscope</option>
                            <option>Chromatography</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Budget ($)</label>
                        <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full p-2 border border-slate-300 rounded" />
                    </div>

                    <div className="col-span-2 bg-slate-50 p-4 rounded border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Tech Specs (AI Auto-fill)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <input placeholder="Capacity" className="p-2 border rounded text-sm" value={formData.cooling_capacity} onChange={(e) => setFormData({ ...formData, cooling_capacity: e.target.value })} />
                            <input placeholder="Min Temp" className="p-2 border rounded text-sm" value={formData.temp_min} onChange={(e) => setFormData({ ...formData, temp_min: e.target.value })} />
                            <input placeholder="Max Temp" className="p-2 border rounded text-sm" value={formData.temp_max} onChange={(e) => setFormData({ ...formData, temp_max: e.target.value })} />
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow w-full font-bold transition-colors disabled:opacity-70"
                >
                    {submitting ? 'Submitting...' : 'Submit RFQ'}
                </button>
            </div>
        </div>
    );
};

export default CreateRFQForm;