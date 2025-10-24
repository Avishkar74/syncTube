// ChatUsers: render list of participants in the room
// Props: users: Array<{ id: string, name: string }>, currentId?: string

export default function ChatUsers({ users = [], currentId }) {
  if (!users.length) {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
        <p style={{ color: '#6b7280' }}>No participants yet</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
      <strong style={{ display: 'block', marginBottom: 8 }}>Participants</strong>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
        {users.map((u) => (
          <li key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
              }}
            />
            <span style={{ color: '#111827' }}>
              {u.name}
              {currentId && u.id === currentId ? ' (you)' : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
