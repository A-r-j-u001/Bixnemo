import Link from 'next/link';
import { Logo } from './Logo';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-8 w-auto" />
                    <span className="text-xl font-medium text-gray-700 dark:text-gray-200">Bixnemo</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Product
                </Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Use Cases
                </Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Pricing
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    Log In
                </Link>
                <Link
                    href="/login"
                    className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
