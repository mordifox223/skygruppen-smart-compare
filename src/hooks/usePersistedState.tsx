
import { useState, useEffect } from 'react';

interface Serializer<T> {
  read: (value: string) => T;
  write: (value: T) => string;
}

function usePersistedState<T>(
  defaultValue: T,
  options: {
    key?: string;
    serializer?: Serializer<T>;
  } = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { 
    key = 'persisted-state',
    serializer = {
      read: (v) => v as T,
      write: (v) => String(v)
    }
  } = options;

  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return serializer.read(item);
      }
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serializer.write(state));
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
    }
  }, [key, state, serializer]);

  return [state, setState];
}

export default usePersistedState;
