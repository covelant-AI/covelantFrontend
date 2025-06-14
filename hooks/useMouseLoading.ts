// hooks/useMouseLoading.ts
import { useEffect } from 'react';

export function useMouseLoading(loading: boolean) {
  useEffect(() => {
    if (loading) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      document.body.style.cursor = 'default'; // fallback in case of unmount
    };
  }, [loading]);
}
