import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEscalatedCases, resolveCase } from '../service/recoveryCase.api';

const Escalations = () => {
    const [cases, setCases] = useState([]);
    const [notes, setNotes] = useState({});
    const [resolvingId, setResolvingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadCases = async () => {
        try {
            setError('');

            const data = await getEscalatedCases();
            setCases(data.cases || []);
        } catch (err) {
            setError('Failed to load escalated cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();
    }, []);

    const handleResolve = async (caseId) => {
        setResolvingId(caseId);

        try {
            await resolveCase(caseId, notes[caseId] || '');
            await loadCases();

            setNotes((prev) => {
                const updated = { ...prev };
                delete updated[caseId];
                return updated;
            });
        } catch (err) {
            setError('Failed to resolve this case. Please try again.');
        } finally {
            setResolvingId(null);
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

            {/* Background glow */}
            <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-white/[0.04] blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

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
                            Escalations
                        </span>
                    </div>

                    <Link
                        to="/home"
                        className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.07] hover:text-white transition"
                    >
                        ← Dashboard
                    </Link>
                </header>

                {/* Heading */}
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
                                Human review queue
                            </p>

                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                                Escalations
                            </h1>

                            <p className="mt-3 text-zinc-400 max-w-2xl">
                                Cases that require manual attention after the automated
                                recovery workflow reaches its limits or requires review.
                            </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-zinc-950/80 px-5 py-3">
                            <p className="text-xs text-zinc-500">
                                Needs attention
                            </p>

                            <p className="text-2xl font-semibold mt-1">
                                {cases.length}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Attention banner */}
                <section className="mb-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
                    <div className="flex items-start gap-4">

                        <div className="shrink-0 w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
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
                                    d="M12 9v3m0 4h.01M10.29 3.86l-7.36 12.75A2 2 0 004.66 19.6h14.68a2 2 0 001.73-2.99L13.71 3.86a2 2 0 00-3.42 0z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium">
                                Manual intervention required
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500 leading-6">
                                Review the recovery context before resolving an escalated
                                case. Your resolution note will be recorded with the case.
                            </p>
                        </div>
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
                            Loading escalations...
                        </p>
                    </div>
                ) : cases.length === 0 ? (

                    /* Empty state */
                    <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-16 text-center">

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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-lg font-medium">
                            Nothing needs attention
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                            There are currently no recovery cases waiting for
                            manual intervention.
                        </p>

                        <Link
                            to="/recovery-cases"
                            className="inline-flex mt-6 px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.07] hover:text-white transition"
                        >
                            View all cases
                        </Link>
                    </section>

                ) : (

                    /* Escalated cases */
                    <section className="space-y-5">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">
                                    Cases requiring review
                                </h2>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Review the failure context and record a resolution.
                                </p>
                            </div>

                            <span className="text-xs text-zinc-600">
                                {cases.length} pending
                            </span>
                        </div>

                        {cases.map((c) => (
                            <article
                                key={c._id}
                                className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden"
                            >

                                {/* Case header */}
                                <div className="px-6 py-5 border-b border-white/10">

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div className="flex items-center gap-4">

                                            <div className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
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

                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-medium">
                                                        {c.customerId?.name || 'Unknown customer'}
                                                    </h3>

                                                    <span className="px-2 py-1 rounded-md border border-white/10 bg-white/[0.04] text-[10px] uppercase tracking-wider text-zinc-400">
                                                        Escalated
                                                    </span>
                                                </div>

                                                <p className="text-xs text-zinc-500 mt-1">
                                                    {c.customerId?.email || 'No email available'}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/recovery-cases/${c._id}`}
                                            className="text-xs text-zinc-500 hover:text-white transition"
                                        >
                                            View case audit trail →
                                        </Link>
                                    </div>
                                </div>

                                {/* Case details */}
                                <div className="p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                                                Payment
                                            </p>

                                            <p className="mt-2 text-sm text-white">
                                                {c.paymentId?.amount ?? '—'}{' '}
                                                {c.paymentId?.currency || ''}
                                            </p>

                                            <p className="mt-1 text-xs text-zinc-500">
                                                {c.paymentId?.status || 'Status unavailable'}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                                                Failure reason
                                            </p>

                                            <p className="mt-2 text-sm text-zinc-300">
                                                {c.paymentId?.failureReason || 'Not provided'}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                                                Case activity
                                            </p>

                                            <div className="flex gap-6 mt-2">
                                                <div>
                                                    <p className="text-sm text-white">
                                                        {c.retryCount ?? 0}
                                                    </p>
                                                    <p className="text-xs text-zinc-600">
                                                        Retries
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-white">
                                                        {c.outreachCount ?? 0}
                                                    </p>
                                                    <p className="text-xs text-zinc-600">
                                                        Outreach
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Escalation reason */}
                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Why this case was escalated
                                            </p>
                                        </div>

                                        <p className="text-sm leading-6 text-zinc-300">
                                            {c.escalationReason || 'No escalation reason provided.'}
                                        </p>
                                    </div>

                                    {/* Resolution */}
                                    <div>
                                        <label
                                            htmlFor={`note-${c._id}`}
                                            className="block text-xs uppercase tracking-wider text-zinc-500 mb-2"
                                        >
                                            Resolution note
                                            <span className="text-zinc-700 normal-case tracking-normal ml-2">
                                                optional
                                            </span>
                                        </label>

                                        <textarea
                                            id={`note-${c._id}`}
                                            value={notes[c._id] || ''}
                                            onChange={(e) =>
                                                setNotes((prev) => ({
                                                    ...prev,
                                                    [c._id]: e.target.value,
                                                }))
                                            }
                                            placeholder="Describe the resolution or manual action taken..."
                                            rows={4}
                                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none resize-none focus:border-white/30 transition"
                                        />

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">

                                            <p className="text-xs text-zinc-600">
                                                This note will be recorded in the case history.
                                            </p>

                                            <button
                                                disabled={resolvingId === c._id}
                                                onClick={() => handleResolve(c._id)}
                                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                {resolvingId === c._id ? (
                                                    <>
                                                        <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                                        Resolving...
                                                    </>
                                                ) : (
                                                    <>
                                                        Mark as resolved
                                                        <span>→</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </article>
                        ))}
                    </section>
                )}

                {/* Footer */}
                <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-zinc-600">
                        Manual resolutions are recorded as part of the recovery audit trail.
                    </p>

                    <p className="text-xs text-zinc-700">
                        AI Revenue Recovery Platform
                    </p>
                </footer>

            </div>
        </main>
    );
};

export default Escalations;