import React from 'react'
import { useEffect } from 'react';
import { useCustomer } from '../hooks/use.customer'
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {

    const { payments = [], handlePaymentList, loading } = useCustomer();
    const navigate = useNavigate();
    const { customerId } = useParams();

    useEffect(() => {
        console.log('customerId from URL:', customerId); // temporary debug log
        if (customerId) {
            handlePaymentList(customerId);
        }
        
    }, [customerId]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Payments</h1>

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