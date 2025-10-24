import { useEffect } from 'react';

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)' }} onClick={onClose}>
      <div style={{ background: 'white', margin: '10% auto', padding: 24, width: 480, borderRadius: 8 }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
