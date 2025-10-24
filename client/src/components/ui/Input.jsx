export default function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${className}`}
    />
  );
}
