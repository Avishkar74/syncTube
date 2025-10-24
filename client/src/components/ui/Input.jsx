export default function Input(props) {
  return (
    <input
      {...props}
      style={{
        padding: '8px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        flex: 1
      }}
    />
  );
}
