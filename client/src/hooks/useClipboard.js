import { useState } from 'react';

export default function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
      console.error('Copy failed', e);
    }
  };
  return { copy, copied };
}
