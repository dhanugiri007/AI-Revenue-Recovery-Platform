import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../../socket';
import { getCasesByCustomer, getCaseAuditTrail } from '../service/recoveryCase.api';

const RecoveryCases = () => {
    const { customerId } = useParams();
    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [auditTrail, setAuditTrail] = useState(null);
    const [loadingAudit, setLoadingAudit] = useState(false);

    const loadCases = async () => {
        const data = await getCasesByCustomer(customerId);
        setCases(data.cases);
    };

    useEffect(() => {
        loadCases();

        socket.emit('joinCustomerRoom', customerId);

        const handleUpdate = (payload) => {
            // live-update the case in the list without a full refetch
            setCases((prev) => {
                const exists = prev.some(c => c._id === payload.caseId);
                if (!exists) {
                    loadCases(); // new case we don't have yet - just refetch
                    return prev;
                }
                return prev.map(c =>
                    c._id === payload.caseId
                        ? { ...c, state: payload.state, retryCount: payload.retryCount, outreachCount: payload.outreachCount }
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
        try {
            const data = await getCaseAuditTrail(caseId);
            setAuditTrail(data);
        } finally {
            setLoadingAudit(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
                <h1>Recovery Cases</h1>
                {cases.length === 0 ? (
                    <p>No recovery cases yet</p>
                ) : (
                    <ul>
                        {cases.map((c) => (
                            <li key={c._id} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => viewAudit(c._id)}>
                                <strong>{c.state.toUpperCase()}</strong> — retries: {c.retryCount}, outreach: {c.outreachCount}
                                <br />
                                <small>{new Date(c.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={{ flex: 2, borderLeft: '1px solid #ccc', paddingLeft: '2rem' }}>
                <h2>Audit Trail</h2>
                {!selectedCaseId && <p>Click a case to view its audit trail</p>}
                {loadingAudit && <p>Loading...</p>}
                {auditTrail && (
                    <div>
                        <p><strong>Case state:</strong> {auditTrail.case.state}</p>
                        {auditTrail.logs.map((log) => (
                            <div key={log._id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                                <strong>{log.step}</strong> — {new Date(log.createdAt).toLocaleTimeString()}

                                {log.policiesRetrieved?.length > 0 && (
                                    <div>
                                        <em>Retrieved policies:</em>
                                        <ul>
                                            {log.policiesRetrieved.map((p, i) => (
                                                <li key={i}>[{p.chunkId}] {p.text.slice(0, 150)}...</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {log.decision && (
                                    <div>
                                        <em>Decision:</em> {log.decision.action} (confidence: {log.decision.confidence})
                                        <br />
                                        <em>Reasoning:</em> {log.decision.reasoning}
                                        <br />
                                        <em>Cited chunk:</em> {log.decision.policyChunkId}
                                    </div>
                                )}

                                {log.outcome && <div><em>Outcome:</em> {log.outcome}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecoveryCases;