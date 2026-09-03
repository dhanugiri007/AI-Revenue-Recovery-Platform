import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  /*
    Replace these values with your actual dashboard API data.

    Example:
    const { dashboardData, loading } = useDashboard();
  */
  const dashboardData = {
    totalCustomers: 0,
    totalPayments: 0,
    failedPayments: 0,
    activeCases: 0,
    recoveredRevenue: 0,
    recoveryRate: 0,
    paymentTrend: [],
    recoveryByStatus: [],
  };

  const navItems = [
    {
      name: 'Overview',
      path: '/home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 13h8V3H3v10zm0 8h8v-4H3v4zm10 0h8V11h-8v10zm0-14h8V3h-8v4z"
          />
        </svg>
      ),
    },
    {
      name: 'Customers',
      path: '/get-customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m6-10a4 4 0 100-8 4 4 0 000 8zm12 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"
          />
        </svg>
      ),
    },
    {
      name: 'Recovery Cases',
      path: '/recovery-cases',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: 'Audit Trail',
      path: '/audit-trail',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
          />
        </svg>
      ),
    },
    {
      name: 'Recovery Policies',
      path: '/policies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7 3h7l4 4v14H7V3zm7 0v5h4"
          />
        </svg>
      ),
    },
  ];

  const statCards = [
    {
      label: 'Customers',
      value: dashboardData.totalCustomers,
      description: 'Customer records',
    },
    {
      label: 'Payments',
      value: dashboardData.totalPayments,
      description: 'Payment events',
    },
    {
      label: 'Failed payments',
      value: dashboardData.failedPayments,
      description: 'Require attention',
    },
    {
      label: 'Active cases',
      value: dashboardData.activeCases,
      description: 'Recovery workflows',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-white/[0.035] blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 min-h-screen flex">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-black/70 backdrop-blur-xl flex-col">

          {/* Logo */}
          <div className="h-20 px-6 flex items-center border-b border-white/10">
            <Link to="/home" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
                R
              </div>

              <span className="font-semibold tracking-tight">
                recover.ai
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">

            <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              Workspace
            </p>

            <div className="space-y-1">

              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    index === 0
                      ? 'bg-white/[0.08] text-white'
                      : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}

            </div>

            {/* System section */}
            <div className="mt-10">

              <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                System
              </p>

              <div className="px-3 py-3 rounded-lg border border-white/[0.07] bg-white/[0.02]">

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />

                  <span className="text-xs text-zinc-400">
                    Recovery engine
                  </span>

                </div>

                <p className="mt-2 text-[11px] text-zinc-600">
                  Event processing and AI workflows
                </p>

              </div>

            </div>

          </nav>

          {/* Sidebar bottom */}
          <div className="p-4 border-t border-white/10">

            <div className="flex items-center gap-3 px-2">

              <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-xs">
                U
              </div>

              <div className="min-w-0">
                <p className="text-xs text-zinc-400 truncate">
                  Recovery workspace
                </p>

                <p className="text-[10px] text-zinc-600">
                  AI Revenue Recovery
                </p>
              </div>

            </div>

          </div>

        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 min-w-0">

          {/* Mobile / top header */}
          <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 lg:px-8">

            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
                R
              </div>

              <span className="font-semibold">
                recover.ai
              </span>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm text-zinc-500">
                Recovery workspace
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs text-zinc-500">
                  Live
                </span>
              </div>

            </div>

          </header>

          <div className="p-6 lg:p-10 max-w-7xl">

            {/* ================= HEADING ================= */}
            <div className="mb-10">

              <div className="flex items-center gap-2 mb-4">

                <span className="h-2 w-2 rounded-full bg-white" />

                <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Overview
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Recovery Dashboard
              </h1>

              <p className="mt-3 text-sm text-zinc-500 max-w-2xl">
                Monitor customer activity, payment events, recovery cases,
                and AI-driven recovery workflows.
              </p>

            </div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5"
                >

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs text-zinc-600">
                    {stat.description}
                  </p>

                </div>
              ))}

            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6 mb-8">

              {/* Payment activity chart */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6">

                <div className="flex items-start justify-between mb-8">

                  <div>
                    <h2 className="font-medium">
                      Payment activity
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      Payment events over time
                    </p>
                  </div>

                  <span className="text-xs text-zinc-600">
                    Recent activity
                  </span>

                </div>

                {/* Chart area */}
                <div className="h-64 flex items-end gap-3">

                  {dashboardData.paymentTrend.length > 0 ? (
                    dashboardData.paymentTrend.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 h-full flex flex-col justify-end"
                      >
                        <div
                          className="bg-white rounded-t-sm min-h-[4px]"
                          style={{
                            height: `${item.value}%`,
                          }}
                        />

                        <span className="mt-3 text-[10px] text-zinc-600 text-center">
                          {item.label}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">

                      <div className="w-full h-px bg-white/[0.07]" />

                      <p className="mt-4 text-sm text-zinc-600">
                        Payment activity will appear here
                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* Recovery overview */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6">

                <div className="mb-8">

                  <h2 className="font-medium">
                    Recovery overview
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Current recovery performance
                  </p>

                </div>

                <div className="space-y-6">

                  <div>
                    <div className="flex justify-between mb-2">

                      <span className="text-xs text-zinc-500">
                        Recovered revenue
                      </span>

                      <span className="text-sm text-zinc-300">
                        {dashboardData.recoveredRevenue}
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">

                      <div
                        className="h-full bg-white rounded-full"
                        style={{
                          width: `${Math.min(
                            dashboardData.recoveryRate,
                            100
                          )}%`,
                        }}
                      />

                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/[0.07]">

                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Recovery rate
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                      {dashboardData.recoveryRate}%
                    </p>

                  </div>

                  <div className="pt-5 border-t border-white/[0.07]">

                    <p className="text-xs uppercase tracking-wider text-zinc-600 mb-3">
                      Case activity
                    </p>

                    {dashboardData.recoveryByStatus.length > 0 ? (
                      dashboardData.recoveryByStatus.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between py-2"
                        >
                          <span className="text-sm text-zinc-500">
                            {item.label}
                          </span>

                          <span className="text-sm text-zinc-300">
                            {item.value}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-600">
                        No case activity yet
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* ================= WORKFLOW ================= */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 lg:p-8">

              <div className="mb-7">

                <h2 className="font-medium">
                  Recovery workflow
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  How payment events move through the recovery system
                </p>

              </div>

              <div className="grid md:grid-cols-5 gap-4">

                {[
                  ['01', 'Payment event', 'Incoming payment signal'],
                  ['02', 'Case creation', 'Recovery case initialized'],
                  ['03', 'RAG retrieval', 'Relevant policy retrieved'],
                  ['04', 'AI decision', 'Bounded action selected'],
                  ['05', 'Audit trail', 'Decision and outcome recorded'],
                ].map(([number, title, description], index) => (
                  <React.Fragment key={number}>

                    <div className="relative">

                      <div className="text-[10px] font-mono text-zinc-700 mb-3">
                        {number}
                      </div>

                      <h3 className="text-sm font-medium">
                        {title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                        {description}
                      </p>

                    </div>

                    {index < 4 && (
                      <div className="hidden md:block text-zinc-700 self-start mt-8">
                        →
                      </div>
                    )}

                  </React.Fragment>
                ))}

              </div>

            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">

              <Link
                to="/get-customers"
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.05] hover:border-white/20 transition-colors"
              >
                <p className="text-sm font-medium">
                  Manage customers
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  View customer records and payment history.
                </p>

                <span className="block mt-4 text-xs text-zinc-500 group-hover:text-white">
                  Open customers →
                </span>
              </Link>

              <Link
                to="/recovery-cases"
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.05] hover:border-white/20 transition-colors"
              >
                <p className="text-sm font-medium">
                  Inspect recovery cases
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Monitor live recovery workflows and AI decisions.
                </p>

                <span className="block mt-4 text-xs text-zinc-500 group-hover:text-white">
                  View cases →
                </span>
              </Link>

              <Link
                to="/policies"
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.05] hover:border-white/20 transition-colors"
              >
                <p className="text-sm font-medium">
                  Manage policies
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Upload and manage documents used by the RAG layer.
                </p>

                <span className="block mt-4 text-xs text-zinc-500 group-hover:text-white">
                  Open policies →
                </span>
              </Link>

            </div>

            {/* Footer */}
            <div className="mt-10 flex items-center gap-3 text-xs text-zinc-700">

              <div className="h-px flex-1 bg-white/[0.07]" />

              <span>
                AI Revenue Recovery Platform
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />

            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Home;