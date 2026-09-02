import React from 'react'
import { useEffect, useState } from 'react';
import { useCustomer } from '../hooks/use.customer'
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {

    const { payments = [], handlePaymentList, handleGeneratePayment, loading } = useCustomer();
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (customerId) {
            handlePaymentList(customerId);
        }
    }, [customerId]);

    const onGenerate = async (status) => {
        setGenerating(true);
        try {
            await handleGeneratePayment(customerId, status);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Payments</h1>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
                <button disabled={generating} onClick={() => onGenerate('success')}>
                    {generating ? 'Generating...' : 'Generate Success Payment'}
                </button>
                <button disabled={generating} onClick={() => onGenerate('failed')}>
                    {generating ? 'Generating...' : 'Generate Failed Payment'}
                </button>
            </div>

            {payments.length === 0 ? (
                <p>No payments found</p>
            ) : (
                <ul>
                    {payments.map((payment) => (
                        <li key={payment.id || payment._id}>
                            {payment.amount} <br />
                            {payment.currency} <br />
                            {payment.status} <br />
                            {payment.failureReason} <br />
                            {payment.paymentMethod} <br/>
                            {payment.attemptCount} <br/>
                            {payment.dueDate} <br/>
                            {payment.failedAt} <br/>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );

}

export default Payment