
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";

import { useAuth } from "../hooks/use.auth.js";

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await handleLogin({ email, password });
            navigate("/home");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
                    <p className="text-sm text-zinc-500">
                        Signing you in...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">

            {/* Background grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
                    `,
                    backgroundSize: "64px 64px",
                }}
            />

            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[130px]" />

            {/* Back to website */}
            <Link
                to="/"
                className="absolute left-6 top-6 z-20 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
            >
                <span className="text-lg">←</span>
                Back to website
            </Link>

            {/* Login card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <Link to="/" className="mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
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
                    </Link>

                    <h1 className="text-3xl font-semibold tracking-[-0.03em]">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Sign in to your recovery workspace
                    </p>
                </div>

                {/* Form container */}
                <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black sm:p-8">

                    {error && (
                        <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-xs font-medium text-zinc-400"
                            >
                                Email address
                            </label>

                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium text-zinc-400"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-xs text-zinc-600 transition hover:text-zinc-300"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                            />
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Sign in

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
                    </form>

                    {/* Register */}
                    <div className="mt-6 border-t border-white/5 pt-6 text-center">
                        <p className="text-sm text-zinc-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-zinc-300 transition hover:text-white"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Project label */}
                <div className="mt-6 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                        AI Revenue Recovery Platform
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Login;

