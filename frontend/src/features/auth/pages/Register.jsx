
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/use.auth.js";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { loading, handleRegister } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await handleRegister({
                username,
                email,
                password,
            });

            navigate("/home");
        } catch (err) {
            setError("Unable to create your account. Please try again.");
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

                    <p className="text-sm text-zinc-500">
                        Creating your account...
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

            {/* Register container */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo + heading */}
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
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Start exploring the recovery platform
                    </p>
                </div>

                {/* Form card */}
                <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black sm:p-8">

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-xs font-medium text-zinc-400"
                            >
                                Username
                            </label>

                            <input
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                required
                                autoComplete="username"
                                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                            />
                        </div>

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
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
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
                            <label
                                htmlFor="password"
                                className="mb-2 block text-xs font-medium text-zinc-400"
                            >
                                Password
                            </label>

                            <input
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                required
                                autoComplete="new-password"
                                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30 focus:bg-white/[0.05]"
                            />

                            <p className="mt-2 text-[11px] text-zinc-700">
                                Choose a password you will remember.
                            </p>
                        </div>

                        {/* Register button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Create account

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

                    {/* Login */}
                    <div className="mt-6 border-t border-white/5 pt-6 text-center">
                        <p className="text-sm text-zinc-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-zinc-300 transition hover:text-white"
                            >
                                Sign in
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

export default Register;

