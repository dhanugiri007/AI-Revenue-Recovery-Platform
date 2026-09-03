import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { socket } from '../../../socket';
import {
    getCasesByCustomer,
    getCaseAuditTrail
} from '../service/recoveryCase.api';

const RecoveryCases = () => {
    const { customerId } = useParams();

    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [auditTrail, setAuditTrail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAudit, setLoadingAudit] = useState(false);
    const [error, setError] = useState('');

    const loadCases = async () => {
        try {
            const data = await getCasesByCustomer(customerId);
            setCases(data.cases || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load recovery cases'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!customerId) return;

        loadCases();

        socket.emit('joinCustomerRoom', customerId);

        const handleUpdate = (payload) => {
            setCases((prev) => {
                const exists = prev.some(
                    (c) => c._id === payload.caseId
                );

                if (!exists) {
                    loadCases();
                    return prev;
                }

                return prev.map((c) =>
                    c._id === payload.caseId
                        ? {
                              ...c,
                              state: payload.state,
                              retryCount: payload.retryCount,
                              outreachCount: payload.outreachCount
                          }
                        : c
                );
            });
        };

        socket.on('recoveryCaseUpdate', handleUpdate);

        return () => {
            socket.off('recoveryCaseUpdate', handleUpdate);
        };
    }, [customerId]);

    const viewAudit = async (caseId) => {
        setSelectedCaseId(caseId);
        setLoadingAudit(true);
        setAuditTrail(null);

        try {
            const data = await getCaseAuditTrail(caseId);
            setAuditTrail(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load audit trail'
            );
        } finally {
            setLoadingAudit(false);
        }
    };

    const getStateStyle = (state) => {
        const normalized = state?.toLowerCase();

        if (
            normalized === 'completed' ||
            normalized === 'success' ||
            normalized === 'recovered'
        ) {
            return 'bg-white text-black border-white';
        }

        if (
            normalized === 'failed' ||
            normalized === 'escalated'
        ) {
            return 'bg-zinc-800 text-white border-zinc-600';
        }

        return 'bg-white/[0.04] text-zinc-300 border-white/10';
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <p className="text-sm text-zinc-500">
                        Loading recovery cases...
                    </p>
                </div>
            </main>
        );
    }

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
                    backgroundSize: '64px 64px'
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
                            to="/get-customers"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            ← Back to customers
                        </Link>

                    </div>
                </header>

                {/* Main */}
                <section className="max-w-7xl mx-auto px-6 py-10">

                    {/* Header */}
                    <div className="mb-8">

                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />

                            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Live recovery system
                            </span>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                            <div>
                                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                                    Recovery Cases
                                </h1>

                                <p className="mt-3 max-w-2xl text-zinc-400 leading-relaxed">
                                    Monitor recovery workflows in real time and
                                    inspect the audit trail behind each AI-driven
                                    decision.
                                </p>
                            </div>

                            {/* Live indicator */}
                            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                Socket.IO connected
                            </div>

                        </div>
                    </div>

                    {/* Architecture strip */}
                    <div className="mb-8 rounded-xl border border-white/10 bg-zinc-950/70 p-5">

                        <div className="flex flex-wrap items-center gap-3 text-xs">

                            <span className="text-zinc-300">
                                Payment event
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-400">
                                Recovery case
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-400">
                                AI + RAG
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-400">
                                Bounded action
                            </span>

                            <span className="text-zinc-700">→</span>

                            <span className="text-zinc-300">
                                Audit trail
                            </span>

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
                            <div className="flex items-start gap-3">
                                <span className="text-zinc-400">!</span>

                                <p className="text-sm text-zinc-400">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Two-column layout */}
                    <div className="grid lg:grid-cols-[0.9fr_1.5fr] gap-6">

                        {/* Cases */}
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden">

                            <div className="px-6 py-5 border-b border-white/[0.07] flex items-center justify-between">

                                <div>
                                    <h2 className="font-medium">
                                        Recovery cases
                                    </h2>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        Select a case to inspect its execution
                                    </p>
                                </div>

                                <span className="text-xs text-zinc-600">
                                    {cases.length} case
                                    {cases.length === 1 ? '' : 's'}
                                </span>

                            </div>

                            {cases.length === 0 ? (
                                <div className="p-10 text-center">

                                    <div className="mx-auto mb-4 h-11 w-11 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
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
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>

                                    <p className="text-sm text-zinc-400">
                                        No recovery cases yet
                                    </p>

                                    <p className="mt-2 text-xs text-zinc-600">
                                        Failed payment events can create recovery
                                        cases automatically.
                                    </p>

                                </div>
                            ) : (
                                <div className="divide-y divide-white/[0.07]">

                                    {cases.map((c) => {
                                        const isSelected =
                                            selectedCaseId === c._id;

                                        return (
                                            <button
                                                key={c._id}
                                                onClick={() => viewAudit(c._id)}
                                                className={`w-full text-left p-5 transition-colors ${
                                                    isSelected
                                                        ? 'bg-white/[0.07]'
                                                        : 'hover:bg-white/[0.03]'
                                                }`}
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <div className="flex items-center gap-3">

                                                            <span
                                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${getStateStyle(
                                                                    c.state
                                                                )}`}
                                                            >
                                                                {c.state}
                                                            </span>

                                                        </div>

                                                        <p className="mt-3 text-xs text-zinc-600">
                                                            {new Date(
                                                                c.createdAt
                                                            ).toLocaleString()}
                                                        </p>

                                                    </div>

                                                    <span className="text-zinc-700">
                                                        →
                                                    </span>

                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-3">

                                                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                            Retries
                                                        </p>

                                                        <p className="mt-1 text-sm text-zinc-300">
                                                            {c.retryCount ?? 0}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                            Outreach
                                                        </p>

                                                        <p className="mt-1 text-sm text-zinc-300">
                                                            {c.outreachCount ?? 0}
                                                        </p>
                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    })}

                                </div>
                            )}

                        </div>

                        {/* Audit Trail */}
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden">

                            <div className="px-6 py-5 border-b border-white/[0.07] flex items-center justify-between">

                                <div>
                                    <h2 className="font-medium">
                                        Audit Trail
                                    </h2>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        AI decisions, retrieved policies and
                                        execution outcomes
                                    </p>
                                </div>

                                {auditTrail?.logs && (
                                    <span className="text-xs text-zinc-600">
                                        {auditTrail.logs.length} event
                                        {auditTrail.logs.length === 1
                                            ? ''
                                            : 's'}
                                    </span>
                                )}

                            </div>

                            {/* No case selected */}
                            {!selectedCaseId && !loadingAudit && (
                                <div className="p-14 text-center">

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
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>

                                    </div>

                                    <h3 className="text-sm font-medium">
                                        Select a recovery case
                                    </h3>

                                    <p className="mt-2 text-xs text-zinc-600">
                                        The case's complete execution history
                                        will appear here.
                                    </p>

                                </div>
                            )}

                            {/* Loading audit */}
                            {loadingAudit && (
                                <div className="p-14 flex flex-col items-center justify-center gap-4">

                                    <div className="h-7 w-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />

                                    <p className="text-sm text-zinc-500">
                                        Loading audit trail...
                                    </p>

                                </div>
                            )}

                            {/* Audit content */}
                            {auditTrail && !loadingAudit && (
                                <div className="p-6">

                                    {/* Case state */}
                                    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">

                                        <div className="flex items-center justify-between gap-4">

                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-zinc-600">
                                                    Current case state
                                                </p>

                                                <p className="mt-2 text-lg font-medium">
                                                    {auditTrail.case?.state}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs ${getStateStyle(
                                                    auditTrail.case?.state
                                                )}`}
                                            >
                                                {auditTrail.case?.state}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Timeline */}
                                    <div className="relative">

                                        <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10" />

                                        <div className="space-y-5">

                                            {auditTrail.logs?.map((log) => (
                                                <div
                                                    key={log._id}
                                                    className="relative pl-8"
                                                >

                                                    {/* Timeline dot */}
                                                    <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-zinc-700 bg-black" />

                                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

                                                        {/* Log header */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                                            <div className="flex items-center gap-3">

                                                                <span className="text-sm font-medium text-white">
                                                                    {log.step}
                                                                </span>

                                                            </div>

                                                            <span className="text-xs text-zinc-600">
                                                                {new Date(
                                                                    log.createdAt
                                                                ).toLocaleString()}
                                                            </span>

                                                        </div>

                                                        {/* Retrieved policies */}
                                                        {log.policiesRetrieved?.length > 0 && (
                                                            <div className="mt-5">

                                                                <p className="text-xs uppercase tracking-wider text-zinc-600">
                                                                    Retrieved policies
                                                                </p>

                                                                <div className="mt-3 space-y-2">

                                                                    {log.policiesRetrieved.map(
                                                                        (p, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="rounded-lg border border-white/[0.07] bg-black/30 p-3"
                                                                            >

                                                                                <p className="text-[10px] text-zinc-600 font-mono">
                                                                                    {p.chunkId}
                                                                                </p>

                                                                                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                                                                                    {p.text?.slice(
                                                                                        0,
                                                                                        250
                                                                                    )}
                                                                                    {p.text?.length >
                                                                                    250
                                                                                        ? '...'
                                                                                        : ''}
                                                                                </p>

                                                                            </div>
                                                                        )
                                                                    )}

                                                                </div>

                                                            </div>
                                                        )}

                                                        {/* Decision */}
                                                        {log.decision && (
                                                            <div className="mt-5 rounded-lg border border-white/[0.07] bg-black/30 p-4">

                                                                <p className="text-xs uppercase tracking-wider text-zinc-600 mb-3">
                                                                    AI decision
                                                                </p>

                                                                <div className="grid sm:grid-cols-2 gap-4">

                                                                    <div>
                                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                                            Action
                                                                        </p>

                                                                        <p className="mt-1 text-sm text-white">
                                                                            {log.decision.action}
                                                                        </p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                                            Confidence
                                                                        </p>

                                                                        <p className="mt-1 text-sm text-zinc-300">
                                                                            {log.decision.confidence}
                                                                        </p>
                                                                    </div>

                                                                    <div className="sm:col-span-2">
                                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                                            Reasoning
                                                                        </p>

                                                                        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                                                                            {log.decision.reasoning}
                                                                        </p>
                                                                    </div>

                                                                    <div className="sm:col-span-2">
                                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                                            Cited policy chunk
                                                                        </p>

                                                                        <p className="mt-1 text-xs font-mono text-zinc-500 break-all">
                                                                            {log.decision.policyChunkId}
                                                                        </p>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        )}

                                                        {/* Outcome */}
                                                        {log.outcome && (
                                                            <div className="mt-4">

                                                                <p className="text-xs uppercase tracking-wider text-zinc-600">
                                                                    Outcome
                                                                </p>

                                                                <p className="mt-1.5 text-sm text-zinc-400">
                                                                    {log.outcome}
                                                                </p>

                                                            </div>
                                                        )}

                                                    </div>

                                                </div>
                                            ))}

                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-10 flex items-center gap-3 text-xs text-zinc-600">

                        <div className="h-px flex-1 bg-white/[0.07]" />

                        <span>
                            Live case updates are delivered through Socket.IO
                        </span>

                        <div className="h-px flex-1 bg-white/[0.07]" />

                    </div>

                </section>
            </div>
        </main>
    );
};

export default RecoveryCases;