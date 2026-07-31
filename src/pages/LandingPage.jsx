import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Library, Database, Zap, ShieldCheck } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-100/50 px-3 py-1 text-sm font-medium text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
            v1.0 is now live
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
            Smart Library Management <br className="hidden sm:block"/>
            <span className="text-primary-600 dark:text-primary-500">System</span>
          </h1>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
            A modern library solution powered by efficient data structures. Seamlessly connecting academic administration with daily library operations.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link to="/login">
              <Button size="lg" className="rounded-full shadow-lg shadow-primary-500/20">
                Get Started
              </Button>
            </Link>
            <Link to="/login?role=admin">
              <Button variant="outline" size="lg" className="rounded-full">
                Librarian Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Engineered with Data Structures
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Built on foundational computer science principles to ensure speed, scalability, and robust performance.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="rounded-lg bg-primary-600/10 p-3 ring-1 ring-primary-600/20 dark:bg-primary-500/10 dark:ring-primary-500/20 mb-6">
                  <Database className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Array-Based Records</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">Utilizing contiguous memory allocation for blazing-fast random access to student and contact records.</p>
                </dd>
              </div>
              <div className="flex flex-col items-start bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="rounded-lg bg-primary-600/10 p-3 ring-1 ring-primary-600/20 dark:bg-primary-500/10 dark:ring-primary-500/20 mb-6">
                  <Library className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Linked List Inventory</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">Dynamic node insertions and deletions for efficient book management without memory reallocation overhead.</p>
                </dd>
              </div>
              <div className="flex flex-col items-start bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="rounded-lg bg-primary-600/10 p-3 ring-1 ring-primary-600/20 dark:bg-primary-500/10 dark:ring-primary-500/20 mb-6">
                  <ShieldCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Secure Transactions</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">OTP-based verification handshakes ensure absolute security during book issuance and returns.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};
