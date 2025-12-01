"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/Logo';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Signup failed');
                }

                // Auto login after signup
                const loginRes = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false
                });

                if (loginRes?.error) throw new Error(loginRes.error);
                router.push('/dashboard');
            } else {
                const res = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false
                });

                if (res?.error) throw new Error('Invalid email or password');
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
            <div className="z-10 flex w-full max-w-md flex-col items-center p-6">
                <motion.div
                    layout
                    className="w-full rounded-3xl border border-gray-200 bg-white/10 p-8 backdrop-blur-xl dark:border-gray-800 dark:bg-black/40 shadow-2xl"
                >
                    <div className="mb-6 flex flex-col items-center">
                        <Logo className="h-12 w-auto mb-4" />

                        {/* Pill Toggle */}
                        <div className="relative flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                            <button
                                onClick={() => { setIsSignUp(false); setError(''); }}
                                className={`relative z-10 px-6 py-1.5 text-sm font-medium rounded-full transition-colors ${!isSignUp ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setIsSignUp(true); setError(''); }}
                                className={`relative z-10 px-6 py-1.5 text-sm font-medium rounded-full transition-colors ${isSignUp ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                Sign Up
                            </button>
                            <motion.div
                                className="absolute top-1 bottom-1 left-1 bg-white dark:bg-zinc-700 rounded-full shadow-sm"
                                initial={false}
                                animate={{
                                    x: isSignUp ? "100%" : "0%",
                                    width: "calc(50% - 4px)"
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>

                        <motion.h2
                            key={isSignUp ? 'signup' : 'signin'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </motion.h2>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <AnimatePresence mode='popLayout'>
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black/50 dark:text-white dark:placeholder-gray-400"
                                        placeholder="John Doe"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black/50 dark:text-white dark:placeholder-gray-400"
                                placeholder="name@company.com or username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black/50 dark:text-white dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {!isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-between overflow-hidden"
                                >
                                    <div className="flex items-center py-1">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                            Forgot password?
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-full border border-gray-300 bg-white/10 px-8 py-3 text-base font-semibold text-gray-900 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed dark:border-gray-700 dark:text-white shadow-lg"
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>
                </motion.div>

                <Link
                    href="/"
                    className="mt-8 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                    ← Back to Home
                </Link>
            </div>
        </main>
    );
};

export default LoginPage;
