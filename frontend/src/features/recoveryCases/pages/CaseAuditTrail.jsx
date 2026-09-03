import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCaseAuditTrail } from '../service/recoveryCase.api';

const CaseAuditTrail = () => {
    const { caseId } = useParams();
    const [auditTrail, setAuditTrail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAuditTrail = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getCaseAuditTrail(caseId);
                setAuditTrail(data);
            } catch (err) {
                setError('Failed to load the case audit trail.');
            } finally {
                setLoading(false);
            }
        };

        if (caseId) {
            loadAuditTrail();
        }
    }, [caseId]);

    const getStateClass = (state) => {
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

    const formatStep = (step) => {
        if (!step) return 'Recovery event';

        return step
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <p className="mt-4 text-sm text-zinc-500">
                        Loading audit trail...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !auditTrail) {
        return (
            <main className="min-h-screen bg-black text-white relative overflow-hidden">

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

                <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
                    <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                            <span className="text-xl text-zinc-500">!</span>
                        </div>

                        <h1 className="mt-5 text-xl font-semibold">
                            Case not found
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            {error || 'The requested recovery case could not be found.'}
                        </p>

                        <Link
                            to="/recovery-cases"
                            className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition"
                        >
                            ← Back to cases
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const currentCase = auditTrail.case;
    const logs = auditTrail.logs || [];

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
                            Case Audit Trail
                        </span>
                    </div>

                    <Link
                        to="/recovery-cases"
                        className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.07] hover:text-white transition"
                    >
                        ← All cases
                    </Link>
                </header>

                {/* Page heading */}
                <section className="mb-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
                        Recovery trace
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                                Case Audit Trail
                            </h1>

                            <p className="mt-3 text-zinc-400 max-w-2xl">
                                Inspect the decisions, retrieved policies, actions,
                                and outcomes recorded during this recovery workflow.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-600 font-mono">
                                {caseId}
                            </span>

                            <span
                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium uppercase tracking-wider ${getStateClass(currentCase?.state)}`}
                            >
                                {currentCase?.state || 'unknown'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Case summary */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

                    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
                        <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Recovery activity
                        </p>

                        <div className="flex gap-8 mt-3">
                            <div>
                                <p className="text-lg font-semibold">
                                    {currentCase?.retryCount ?? 0}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Retries
                                </p>
                            </div>

                            <div>
                                <p className="text-lg font-semibold">
                                    {currentCase?.outreachCount ?? 0}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Outreach
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow */}
                <section className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 overflow-x-auto">
                    <div className="flex items-center min-w-max">

                        {[
                            'Event received',
                            'Case created',
                            'Policy retrieval',
                            'AI decision',
                            'Recovery action',
                            'Outcome'
                        ].map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex items-center gap-3 px-3">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 bg-white/[0.04] text-[10px] text-zinc-500">
                                        0{index + 1}
                                    </span>

                                    <span className="text-xs text-zinc-400">
                                        {step}
                                    </span>
                                </div>

                                {index < 5 && (
                                    <span className="text-zinc-700">
                                        →
                                    </span>
                                )}
                            </React.Fragment>
                        ))}

                    </div>
                </section>

                {/* Audit timeline */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-medium">
                                Execution timeline
                            </h2>

                            <p className="text-sm text-zinc-500 mt-1">
                                Recorded events from the recovery workflow.
                            </p>
                        </div>

                        <span className="text-xs text-zinc-600">
                            {logs.length} {logs.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>

                    {logs.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-12 text-center">
                            <p className="text-sm text-zinc-500">
                                No audit events recorded for this case.
                            </p>
                        </div>
                    ) : (
                        <div className="relative">

                            {/* Timeline line */}
                            <div className="absolute left-[15px] top-5 bottom-5 w-px bg-white/10" />

                            <div className="space-y-6">
                                {logs.map((log, index) => (
                                    <div
                                        key={log._id || index}
                                        className="relative pl-12"
                                    >

                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-5 w-8 h-8 rounded-full border border-white/10 bg-black flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden">

                                            {/* Event header */}
                                            <div className="px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium">
                                                        {formatStep(log.step)}
                                                    </span>

                                                    <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-zinc-500">
                                                        EVENT {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <span className="text-xs text-zinc-600">
                                                    {log.createdAt
                                                        ? new Date(log.createdAt).toLocaleString()
                                                        : 'Unknown time'}
                                                </span>
                                            </div>

                                            <div className="p-5 space-y-5">

                                                {/* Retrieved policies */}
                                                {log.policiesRetrieved?.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-xs uppercase tracking-wider text-zinc-500">
                                                                Retrieved policies
                                                            </span>

                                                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-zinc-500">
                                                                RAG
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {log.policiesRetrieved.map((policy, i) => (
                                                                <div
                                                                    key={policy.chunkId || i}
                                                                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                                                                >
                                                                    <div className="flex items-center justify-between gap-4 mb-2">
                                                                        <span className="font-mono text-[11px] text-zinc-500">
                                                                            {policy.chunkId || 'unknown-chunk'}
                                                                        </span>

                                                                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                                            Retrieved
                                                                        </span>
                                                                    </div>

                                                                    <p className="text-sm leading-6 text-zinc-400">
                                                                        {policy.text || 'No policy text available.'}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* AI decision */}
                                                {log.decision && (
                                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

                                                        <div className="flex items-center justify-between gap-4 mb-4">
                                                            <div>
                                                                <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                                    AI decision
                                                                </p>

                                                                <p className="mt-2 text-lg font-medium">
                                                                    {log.decision.action || 'No action'}
                                                                </p>
                                                            </div>

                                                            {log.decision.confidence !== undefined && (
                                                                <div className="text-right">
                                                                    <p className="text-xs text-zinc-600">
                                                                        Confidence
                                                                    </p>

                                                                    <p className="mt-1 text-lg font-semibold">
                                                                        {typeof log.decision.confidence === 'number'
                                                                            ? `${Math.round(log.decision.confidence * 100)}%`
                                                                            : log.decision.confidence}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {log.decision.reasoning && (
                                                            <div className="pt-4 border-t border-white/10">
                                                                <p className="text-xs uppercase tracking-wider text-zinc-600 mb-2">
                                                                    Reasoning
                                                                </p>

                                                                <p className="text-sm leading-6 text-zinc-400">
                                                                    {log.decision.reasoning}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {log.decision.policyChunkId && (
                                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                                <p className="text-xs uppercase tracking-wider text-zinc-600 mb-2">
                                                                    Cited policy chunk
                                                                </p>

                                                                <span className="inline-flex px-2.5 py-1 rounded-md border border-white/10 bg-black font-mono text-xs text-zinc-400">
                                                                    {log.decision.policyChunkId}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Outcome */}
                                                {log.outcome && (
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wider text-zinc-600 mb-2">
                                                            Outcome
                                                        </p>

                                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                                                            <p className="text-sm text-zinc-300">
                                                                {log.outcome}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-zinc-600">
                        Audit records provide traceability for AI decisions and recovery actions.
                    </p>

                    <p className="text-xs text-zinc-700">
                        AI Revenue Recovery Platform
                    </p>
                </footer>

            </div>
        </main>
    );
};

export default CaseAuditTrail;