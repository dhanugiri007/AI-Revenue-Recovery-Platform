import React, { useEffect, useState } from 'react';
import { useCustomer } from '../hooks/use.customer';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
  const {
    payments = [],
    handlePaymentList,
    handleGeneratePayment,
    loading,
  } = useCustomer();

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

      // Refresh payments after generating a new one
      await handlePaymentList(customerId);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm text-zinc-500">
            Loading payments...
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

            <button
              onClick={() => navigate('/get-customers')}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to customers
            </button>
          </div>
        </header>

        {/* Main */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {/* Page heading */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Payment activity
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Payments
              </h1>

              <p className="mt-3 text-zinc-400 max-w-2xl leading-relaxed">
                Inspect payment history and generate payment events to
                exercise the recovery workflow.
              </p>
            </div>

            {/* Generate buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={generating}
                onClick={() => onGenerate('success')}
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'Generating...' : '+ Success payment'}
              </button>

              <button
                disabled={generating}
                onClick={() => onGenerate('failed')}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'Generating...' : '+ Failed payment'}
              </button>
            </div>
          </div>

          {/* Technical workflow hint */}
          <div className="mb-8 rounded-xl border border-white/10 bg-zinc-950/70 p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-zinc-500">
                Payment event
              </span>

              <span className="text-zinc-700">→</span>

              <span className="text-zinc-400">
                Recovery processing
              </span>

              <span className="text-zinc-700">→</span>

              <span className="text-zinc-400">
                AI decision
              </span>

              <span className="text-zinc-700">→</span>

              <span className="text-zinc-400">
                Bounded action
              </span>
            </div>
          </div>

          {/* Payment count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-zinc-500">
              {payments.length === 0
                ? 'No payment records'
                : `${payments.length} payment${payments.length === 1 ? '' : 's'}`}
            </p>

           
          </div>

          {/* Empty state */}
          {payments.length === 0 ? (
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m0-2c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-medium">
                No payments found
              </h2>

              <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                Generate a payment event to test the payment and recovery
                workflow.
              </p>
            </div>
          ) : (
            /* Payments */
            <div className="grid gap-4">
              {payments.map((payment) => {
                const paymentId = payment.id || payment._id;
                const isFailed = payment.status?.toLowerCase() === 'failed';

                return (
                  <div
                    key={paymentId}
                    className="rounded-2xl border border-white/10 bg-zinc-950/80 hover:border-white/20 transition-colors"
                  >
                    <div className="p-6">
                      {/* Top row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                            Payment
                          </p>

                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-2xl font-semibold tracking-tight">
                              {payment.amount}
                            </span>

                            <span className="text-sm text-zinc-500 uppercase">
                              {payment.currency}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium ${
                            isFailed
                              ? 'border-white/10 bg-white/[0.03] text-zinc-300'
                              : 'border-white/10 bg-white text-black'
                          }`}
                        >
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                          {payment.status || 'Unknown'}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-6 pt-5 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Payment method
                          </p>

                          <p className="mt-1.5 text-sm text-zinc-300">
                            {payment.paymentMethod || '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Attempts
                          </p>

                          <p className="mt-1.5 text-sm text-zinc-300">
                            {payment.attemptCount ?? '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Due date
                          </p>

                          <p className="mt-1.5 text-sm text-zinc-300">
                            {payment.dueDate
                              ? new Date(payment.dueDate).toLocaleDateString()
                              : '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Failed at
                          </p>

                          <p className="mt-1.5 text-sm text-zinc-300">
                            {payment.failedAt
                              ? new Date(payment.failedAt).toLocaleString()
                              : '—'}
                          </p>
                        </div>
                      </div>

                      {/* Failure reason */}
                      {payment.failureReason && (
                        <div className="mt-5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Failure reason
                          </p>

                          <p className="mt-1.5 text-sm text-zinc-400">
                            {payment.failureReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 flex items-center gap-3 text-xs text-zinc-600">
            <div className="h-px flex-1 bg-white/[0.07]" />

            <span>
              Payment events feed the recovery workflow
            </span>

            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Payment;