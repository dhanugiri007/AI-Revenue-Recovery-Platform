import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    uploadPolicy,
    getPolicies,
    togglePolicy,
    deletePolicy
} from '../service/policy.api';

const PolicyUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [error, setError] = useState('');

    const loadPolicies = async () => {
        try {
            const data = await getPolicies();
            setPolicies(data.policies || []);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to load recovery policies'
            );
        }
    };

    useEffect(() => {
        loadPolicies();
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            await uploadPolicy(file);
            setFile(null);
            await loadPolicies();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Upload failed'
            );
        } finally {
            setUploading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await togglePolicy(id);
            await loadPolicies();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to update policy'
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePolicy(id);
            await loadPolicies();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to delete policy'
            );
        }
    };

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">

            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-white/[0.04] blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">

                {/* Navbar */}
                <header className="border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                        <Link
                            to="/home"
                            className="flex items-center gap-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
                                R
                            </div>

                            <span className="font-semibold tracking-tight">
                                recover.ai
                            </span>
                        </Link>

                        <Link
                            to="/home"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            ← Back to dashboard
                        </Link>

                    </div>
                </header>

                {/* Main content */}
                <section className="max-w-6xl mx-auto px-6 py-12">

                    {/* Heading */}
                    <div className="mb-10">

                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-2 w-2 rounded-full bg-white" />

                            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Knowledge base
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Recovery Policies
                        </h1>

                        <p className="mt-3 max-w-2xl text-zinc-400 leading-relaxed">
                            Upload and manage recovery policy documents used by
                            the AI agent when making recovery decisions.
                        </p>

                    </div>

                    {/* Architecture flow */}
                    <div className="mb-8 rounded-xl border border-white/10 bg-zinc-950/70 p-5">

                        <div className="flex flex-wrap items-center gap-3 text-xs">

                            <span className="text-zinc-300">
                                Policy PDF
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-400">
                                Document processing
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-400">
                                Chunking & indexing
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-300">
                                RAG retrieval
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-400">
                                AI recovery decision
                            </span>

                        </div>

                    </div>

                    {/* Upload section */}
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 md:p-8 mb-8">

                        <div className="flex items-start gap-4 mb-6">

                            <div className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-zinc-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M12 16V4m0 0L8 8m4-4l4 4M5 20h14"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium">
                                    Upload recovery policy
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Add a PDF policy document to the retrieval
                                    knowledge base.
                                </p>
                            </div>

                        </div>

                        {/* File selector */}
                        <label
                            htmlFor="policy-file"
                            className="group block cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center hover:border-white/30 hover:bg-white/[0.04] transition-all"
                        >

                            <div className="mx-auto mb-4 h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">

                                <svg
                                    className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M7 18a4.6 4.6 0 01-.88-9.115A5.002 5.002 0 0116.9 7H17a4 4 0 010 8h-1m-4-4l-3 3m0 0l-3-3m3 3V10"
                                    />
                                </svg>

                            </div>

                            {file ? (
                                <>
                                    <p className="text-sm font-medium text-white">
                                        {file.name}
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-zinc-300">
                                        Choose a recovery policy PDF
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        PDF files only
                                    </p>
                                </>
                            )}

                            <input
                                id="policy-file"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                            />

                        </label>

                        {/* Upload button */}
                        <div className="mt-5 flex justify-end">

                            <button
                                disabled={!file || uploading}
                                onClick={handleUpload}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploading ? (
                                    <>
                                        <span className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                        Uploading & indexing...
                                    </>
                                ) : (
                                    'Upload policy'
                                )}
                            </button>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                                <div className="flex items-start gap-3">

                                    <span className="mt-0.5 text-zinc-400">
                                        !
                                    </span>

                                    <p className="text-sm text-zinc-400">
                                        {error}
                                    </p>

                                </div>
                            </div>
                        )}

                    </div>

                    {/* Policy list heading */}
                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-xl font-medium">
                                Policy documents
                            </h2>

                            <p className="mt-1 text-sm text-zinc-600">
                                Manage indexed recovery policies available to
                                the AI agent.
                            </p>
                        </div>

                        <span className="text-xs text-zinc-600">
                            {policies.length} document
                            {policies.length === 1 ? '' : 's'}
                        </span>

                    </div>

                    {/* Empty state */}
                    {policies.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-12 text-center">

                            <div className="mx-auto mb-5 h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">

                                <svg
                                    className="w-5 h-5 text-zinc-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M7 3h7l4 4v14H7V3z"
                                    />
                                </svg>

                            </div>

                            <h3 className="text-lg font-medium">
                                No policies uploaded
                            </h3>

                            <p className="mt-2 max-w-md mx-auto text-sm text-zinc-500">
                                Upload a recovery policy PDF to make its
                                contents available to the RAG pipeline.
                            </p>

                        </div>
                    ) : (
                        <div className="grid gap-4">

                            {policies.map((p) => (
                                <div
                                    key={p._id}
                                    className="rounded-2xl border border-white/10 bg-zinc-950/80 hover:border-white/20 transition-colors"
                                >
                                    <div className="p-6">

                                        {/* Top */}
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                                            <div className="flex items-start gap-4 min-w-0">

                                                <div className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-zinc-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M7 3h7l4 4v14H7V3z"
                                                        />
                                                    </svg>
                                                </div>

                                                <div className="min-w-0">

                                                    <h3 className="text-sm font-medium text-white truncate">
                                                        {p.filename}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">

                                                        <span>
                                                            Version {p.version}
                                                        </span>

                                                        <span className="text-zinc-700">
                                                            /
                                                        </span>

                                                        <span>
                                                            {p.chunkCount} chunks
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* Status */}
                                            <span
                                                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs ${
                                                    p.active
                                                        ? 'border-white/20 bg-white text-black'
                                                        : 'border-white/10 bg-white/[0.03] text-zinc-500'
                                                }`}
                                            >
                                                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                                                {p.active ? 'Active' : 'Inactive'}
                                            </span>

                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                            <p className="text-xs text-zinc-600">
                                                {p.active
                                                    ? 'Available for policy retrieval'
                                                    : 'Excluded from active retrieval'}
                                            </p>

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleToggle(p._id)
                                                    }
                                                    className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                                                >
                                                    {p.active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(p._id)
                                                    }
                                                    className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-colors"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* Footer hint */}
                    <div className="mt-10 flex items-center gap-3 text-xs text-zinc-600">

                        <div className="h-px flex-1 bg-white/[0.07]" />

                        <span>
                            Active policies are available to the RAG retrieval layer
                        </span>

                        <div className="h-px flex-1 bg-white/[0.07]" />

                    </div>

                </section>
            </div>
        </main>
    );
};

export default PolicyUpload;