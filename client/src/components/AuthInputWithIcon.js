'use client';

export default function AuthInputWithIcon({ icon, type = "text", placeholder, value, onChange, error, id }) {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {icon}
            </span>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                    error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                required
                suppressHydrationWarning={true}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
