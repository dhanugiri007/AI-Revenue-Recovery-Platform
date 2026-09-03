import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../../../socket';
import { getAllCases } from '../service/recoveryCase.api';

const RecoveryCasesList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadCases = async () => {
        try {
            setError('');
            const data = await getAllCases();
            setCases(data.cases || []);
        } catch (err) {
            setError('Failed to load recovery cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();

        // Global recovery case view:
        // refresh whenever any recovery case changes.
        const handleUpdate = () => loadCases();

        socket.on('recoveryCaseUpdate', handleUpdate);

        return () => socket.off('recoveryCaseUpdate', handleUpdate);
    }, []);

    const getStatusClass = (state) => {
        switch (state?.toLowerCase()) {
            case 'recovered':
            case 'completed':
            case 'success':
                return 'border-white/20 bg-white/[0.08] text-white';

            case 'failed':
            case 'exhausted':
                return 'border-red-400/20 bg-red-400/[0.06] text-red-300';

            case 'processing':
            case 'retrying':
            case 'in_progress':
                return 'border-yellow-400/20 bg-yellow-400/[0.06] text-yellow-300';

            default:
                return 'border-white/10 bg-white/[0.04] text-zinc-300';
        }
    };

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">

            {/* Background grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.16]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Glow */}
            <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.04] blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/home"
                            className="text-xl font-semibold tracking-tight hover:text-zinc-300 transition"
                        >
                            recover<span className="text-zinc-500">.ai</span>
                        </Link>

                        <span className="hidden sm:block h-5 w-px bg-white/10" />

                        <span className="hidden sm:block text-sm text-zinc-500">
                            Recovery Cases
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03]">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>

                            <span className="text-xs text-zinc-400">
                                Live updates
                            </span>
                        </div>

                        <Link
                            to="/home"
                            className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.07] hover:text-white transition"
                        >
                            ← Dashboard
                        </Link>
                    </div>
                </header>

                {/* Page heading */}
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
                                Live recovery system
                            </p>

                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                                Recovery Cases
                            </h1>

                            <p className="mt-3 text-zinc-400 max-w-2xl">
                                Monitor payment recovery workflows across customers,
                                including AI decisions, retry attempts, and recovery outcomes.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-white/10 bg-zinc-950/80 px-5 py-3">
                                <p className="text-xs text-zinc-500">
                                    Total cases
                                </p>
                                <p className="text-2xl font-semibold mt-1">
                                    {cases.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Architecture strip */}
                <section className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 overflow-x-auto">
                    <div className="flex items-center min-w-max">
                        {[
                            'Payment event',
                            'Recovery case',
                            'AI + RAG',
                            'Bounded action',
                            'Audit trail'
                        ].map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex items-center gap-3 px-4">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-zinc-400">
                                        0{index + 1}
                                    </span>

                                    <span className="text-sm text-zinc-300">
                                        {step}
                                    </span>
                                </div>

                                {index < 4 && (
                                    <span className="text-zinc-700">
                                        →
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <p className="mt-4 text-sm text-zinc-500">
                            Loading recovery cases...
                        </p>
                    </div>
                ) : cases.length === 0 ? (

                    /* Empty state */
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-16 text-center">
                        <div className="mx-auto w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-zinc-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-lg font-medium">
                            No recovery cases yet
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                            Failed payment events will create recovery cases here
                            when the recovery workflow is triggered.
                        </p>

                        <Link
                            to="/get-customers"
                            className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition"
                        >
                            View customers
                        </Link>
                    </div>

                ) : (

                    /* Cases */
                    <section className="space-y-3">

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-medium">
                                    All recovery cases
                                </h2>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Select a case to inspect its recovery workflow and audit trail.
                                </p>
                            </div>

                            <span className="text-xs text-zinc-600 hidden sm:block">
                                Updates automatically via Socket.IO
                            </span>
                        </div>

                        {cases.map((c) => (
                            <Link
                                key={c._id}
                                to={`/recovery-cases/${c._id}`}
                                className="group block rounded-2xl border border-white/10 bg-zinc-950/80 hover:bg-white/[0.04] hover:border-white/20 transition"
                            >
                                <div className="p-5">

                                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                                        {/* Case identity */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">

                                            <div className="w-11 h-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-zinc-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-md border text-[11px] font-medium uppercase tracking-wider ${getStatusClass(c.state)}`}
                                                    >
                                                        {c.state || 'unknown'}
                                                    </span>

                                                    <span className="text-xs text-zinc-600">
                                                        #{c._id?.slice(-8)}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm font-medium text-white truncate">
                                                    {c.customerId?.name || 'Unknown customer'}
                                                </p>

                                                <p className="text-xs text-zinc-500 truncate mt-1">
                                                    {c.customerId?.email || 'No customer email'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment */}
                                        <div className="lg:w-44">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-600 mb-1">
                                                Payment
                                            </p>

                                            <p className="text-sm text-zinc-200">
                                                {c.paymentId?.amount ?? '—'}{' '}
                                                {c.paymentId?.currency || ''}
                                            </p>

                                            {c.paymentId?.status && (
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    {c.paymentId.status}
                                                </p>
                                            )}
                                        </div>

                                        {/* Recovery activity */}
                                        <div className="flex items-center gap-6 lg:w-52">

                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-zinc-600 mb-1">
                                                    Retries
                                                </p>

                                                <p className="text-sm text-zinc-200">
                                                    {c.retryCount ?? 0}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-zinc-600 mb-1">
                                                    Outreach
                                                </p>

                                                <p className="text-sm text-zinc-200">
                                                    {c.outreachCount ?? 0}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Created */}
                                        <div className="lg:w-48">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-600 mb-1">
                                                Created
                                            </p>

                                            <p className="text-xs text-zinc-400">
                                                {c.createdAt
                                                    ? new Date(c.createdAt).toLocaleString()
                                                    : '—'}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-zinc-500 group-hover:text-white group-hover:border-white/20 transition">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </section>
                )}

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-zinc-600">
                        Recovery state updates are streamed through Socket.IO.
                    </p>

                    <p className="text-xs text-zinc-700">
                        AI Revenue Recovery Platform
                    </p>
                </div>
            </div>
        </main>
    );
};

export default RecoveryCasesList;