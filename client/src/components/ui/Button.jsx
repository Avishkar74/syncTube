export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: '8px 12px',
        background: '#3b82f6',
        color: 'white',
        border: 0,
        borderRadius: 6,
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}
