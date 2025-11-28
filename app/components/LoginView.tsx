import React from 'react';
import { Logo } from './Logo';

interface LoginViewProps {
    onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onBack }) => {
    return (
        <div className="z-10 flex w-full max-w-md flex-col items-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full rounded-3xl border border-gray-200 bg-white/10 p-8 backdrop-blur-xl dark:border-gray-800 dark:bg-black/40 shadow-2xl">
                <div className="mb-8 flex flex-col items-center">
                    <Logo className="h-12 w-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black/50 dark:text-white dark:placeholder-gray-400"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black/50 dark:text-white dark:placeholder-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
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
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-[0.98]"
                    >
                        Sign in
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button onClick={onBack} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Sign up
                    </button>
                </div>
            </div>

            <button
                onClick={onBack}
                className="mt-8 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-2"
            >
                ← Back to Home
            </button>
        </div>
    );
};

export default LoginView;
