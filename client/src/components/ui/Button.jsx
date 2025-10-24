export default function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md border border-transparent transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
