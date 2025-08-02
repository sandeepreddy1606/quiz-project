import { motion } from 'framer-motion';

export default function FormInput({ id, label, type = 'text', value, onChange, error, ...props }) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`
          peer w-full px-4 py-3 bg-slate-700/50 border-2 rounded-lg text-white 
          placeholder-transparent focus:outline-none focus:border-blue-500
          transition-colors
          ${error ? 'border-red-500' : 'border-slate-600'}
        `}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 -top-2.5 px-1 bg-slate-800 text-sm transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
          peer-focus:-top-2.5 peer-focus:text-sm
          ${error ? 'text-red-400' : 'text-slate-400 peer-focus:text-blue-400'}
        `}
      >
        {label}
      </label>
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}