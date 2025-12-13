import React, { useState } from 'react';
import { Sparkles, X, CheckCircle } from 'lucide-react';
import { callGeminiProposalGenerator } from '../../api/geminiAI';
import { submitBid } from '../../api/azureSQL';
import { useAuth } from '../../hooks/useAuth';

const BidModal = ({ lead, onClose }) => {
    const [price, setPrice] = useState('');
    const [proposalText, setProposalText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();

    const handleGenerateProposal = async () => {
        if (!price) return alert("Enter a price first so Gemini can generate a quote.");
        setIsGenerating(true);
        const text = await callGeminiProposalGenerator(lead.title, price);
        setProposalText(text);
        setIsGenerating(false);
    };

    const handleSubmit = async () => {
        if (!price || !proposalText) {
            alert("Please enter a price and proposal.");
            return;
        }

        setSubmitting(true);
        try {
            await submitBid({
                rfqId: lead.id,
                rfqTitle: lead.title,
                vendorName: user?.name || 'Unknown Vendor',
                vendorEmail: user?.email || 'unknown@example.com',
                price: price,
                proposal: proposalText
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            alert("Failed to submit bid: " + error.message);
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                <div className="bg-white rounded-xl max-w-lg w-full p-8 text-center shadow-2xl">
                    <div className="bg-green-100 p-4 rounded-full inline-block mb-4 text-green-600">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Bid Submitted!</h3>
                    <p className="text-slate-500">Your proposal has been sent to the customer.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>

                <h3 className="text-xl font-bold text-slate-800 mb-1">Submit Bid</h3>
                <p className="text-sm text-slate-500 mb-6">Ref: #{lead.id} - {lead.title}</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Offer Price ($)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border border-slate-300 rounded" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Proposal Letter</label>
                            <button onClick={handleGenerateProposal} disabled={isGenerating} className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-200 hover:bg-purple-100 transition-colors">
                                {isGenerating ? 'Drafting...' : <><Sparkles size={12} /> Gemini Assistant</>}
                            </button>
                        </div>
                        <textarea value={proposalText} onChange={(e) => setProposalText(e.target.value)} className="w-full p-2 border border-slate-300 rounded h-32 text-sm" placeholder="Write proposal..." />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold shadow-lg transition-colors disabled:opacity-70"
                    >
                        {submitting ? 'Sending...' : 'Send Quote'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BidModal;