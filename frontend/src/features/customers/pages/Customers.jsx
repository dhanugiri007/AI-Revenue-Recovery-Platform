import React, { useEffect } from 'react';
import { useCustomer } from '../hooks/use.customer';
import { useNavigate, Link } from 'react-router-dom';

const Customers = () => {
  const { customers = [], handleCustomerList, loading } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    handleCustomerList();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm text-zinc-500">Loading customers...</p>
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
              className="flex items-center gap-2 group"
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

        {/* Main */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Customer management
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Customers
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-400 leading-relaxed">
                Manage customer records and inspect payment activity used by
                the recovery workflow.
              </p>
            </div>

            <button
              onClick={() => navigate('/create-customer')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Create Customer
            </button>
          </div>

          {/* Customer count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              {customers.length === 0
                ? 'No customer records'
                : `${customers.length} customer${customers.length === 1 ? '' : 's'}`}
            </p>

            <div className="text-xs text-zinc-600">
              Customer records
            </div>
          </div>

          {/* Empty state */}
          {customers.length === 0 ? (
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
                    d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m6-10a4 4 0 100-8 4 4 0 000 8zm12 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-medium">
                No customers found
              </h2>

              <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                Create a customer to start tracking payment activity and
                recovery workflows.
              </p>

              <button
                onClick={() => navigate('/create-customer')}
                className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
              >
                Create your first customer
              </button>
            </div>
          ) : (
            /* Customer list */
            <div className="grid gap-4">
              {customers.map((customer) => {
                const customerId = customer.id || customer._id;

                return (
                  <div
                    key={customerId}
                    className="group rounded-2xl border border-white/10 bg-zinc-950/80 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Customer identity */}
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-sm font-semibold">
                            {customer.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>

                          <div className="min-w-0">
                            <h2 className="font-medium text-white truncate">
                              {customer.name}
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500 truncate">
                              {customer.email}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-wider text-zinc-600">
                            Status
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                            {customer.status || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mt-6 pt-5 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Phone
                          </p>
                          <p className="mt-1.5 text-sm text-zinc-300">
                            {customer.phone || '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Customer Type
                          </p>
                          <p className="mt-1.5 text-sm text-zinc-300 capitalize">
                            {customer.customerType || '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-zinc-600">
                            Total Revenue
                          </p>
                          <p className="mt-1.5 text-sm text-zinc-300">
                            {customer.totalRevenue ?? '—'}
                          </p>
                        </div>

                        <div className="flex items-end sm:items-center lg:justify-end">
                          <button
                            onClick={() =>
                              navigate(
                                `/get-customer-payments/${customerId}`
                              )
                            }
                            className="w-full lg:w-auto rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-colors"
                          >
                            View payments →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer hint */}
          <div className="mt-10 flex items-center gap-3 text-xs text-zinc-600">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span>
              Payment activity can be inspected per customer
            </span>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Customers;