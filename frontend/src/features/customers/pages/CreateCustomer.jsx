
import React, { useState } from "react";
import { useCustomer } from "../hooks/use.customer";
import { useNavigate, Link } from "react-router";

const CreateCustomer = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        customerType: "",
    });

    const [error, setError] = useState("");

    const { loading, handleCreateCustomer } = useCustomer();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const data = await handleCreateCustomer({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            customerType: formData.customerType,
        });

        if (data?.customer) {
            navigate("/get-customers");
        } else {
            setError(
                "Failed to create customer. Please check the form and try again."
            );
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

                    <p className="text-sm text-zinc-500">
                        Creating customer...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-white">

            {/* Background grid */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "64px 64px",
                }}
            />

            {/* Background glow */}
            <div className="pointer-events-none fixed left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[130px]" />

            {/* Header */}
            <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between">
                <Link
                    to="/home"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </div>

                    <span className="text-lg font-semibold tracking-tight">
                        recover.ai
                    </span>
                </Link>

                <Link
                    to="/get-customers"
                    className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
                >
                    <span>←</span>
                    Customers
                </Link>
            </header>

            {/* Content */}
            <section className="relative z-10 mx-auto max-w-2xl pb-20 pt-16">

                {/* Heading */}
                <div className="mb-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-600">
                        Customer management
                    </p>

                    <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                        Create customer
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                        Add a customer to the recovery system so their payment
                        activity and recovery cases can be tracked.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black">

                    {/* Card header */}
                    <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-4 w-4 text-zinc-300"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M19 8v6" />
                                    <path d="M22 11h-6" />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-sm font-medium">
                                    Customer details
                                </h2>

                                <p className="mt-0.5 text-xs text-zinc-600">
                                    Enter the customer's information below.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 p-6 sm:p-8"
                    >
                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                                <span className="mt-0.5 text-sm text-zinc-400">
                                    !
                                </span>

                                <p className="text-sm leading-5 text-zinc-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-xs font-medium text-zinc-400"
                            >
                                Customer name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                                required
                                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                            />
                        </div>

                        {/* Email + Phone */}
                        <div className="grid gap-6 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-xs font-medium text-zinc-400"
                                >
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="customer@example.com"
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-xs font-medium text-zinc-400"
                                >
                                    Phone number
                                </label>

                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                                />
                            </div>
                        </div>

                        {/* Customer type */}
                        <div>
                            <label
                                htmlFor="customerType"
                                className="mb-2 block text-xs font-medium text-zinc-400"
                            >
                                Customer type
                            </label>

                            <select
                                id="customerType"
                                name="customerType"
                                value={formData.customerType}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/[0.05]"
                            >
                                <option
                                    value=""
                                    disabled
                                    className="bg-zinc-950"
                                >
                                    Select customer type
                                </option>

                                <option
                                    value="individual"
                                    className="bg-zinc-950"
                                >
                                    Individual
                                </option>

                                <option
                                    value="business"
                                    className="bg-zinc-950"
                                >
                                    Business
                                </option>
                            </select>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/5" />

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <Link
                                to="/get-customers"
                                className="flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="group flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                            >
                                Create customer

                                <svg
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M4 10h12M11 5l5 5-5 5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer hint */}
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                    Customer data will be used by recovery workflows
                </div>
            </section>
        </main>
    );
};

export default CreateCustomer;

