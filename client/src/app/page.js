import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-800">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
          The Ultimate
          <span className="text-yellow-500"> Knowledge Challenge</span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 mb-10">
          Test your skills, challenge your mind, and see where you stand.
        </p>
        <div className="flex justify-center">
          <Link href="/auth">
            <button className="flex items-center gap-3 px-8 py-4 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Get Started
              <FiArrowRight size={20} />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}