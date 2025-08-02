'use client';

export default function AuthInputWithIcon({ icon, type = "text", placeholder, value, onChange, error, id }) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
        {icon}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}
          focus:ring-2
        `}
        required
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}