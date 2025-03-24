import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State to store the value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check if window is defined (to avoid SSR issues)
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // Get from localStorage by key
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Effect to update localStorage when state changes
  useEffect(() => {
    try {
      // Check if window is defined (to avoid SSR issues)
      if (typeof window === 'undefined') {
        return;
      }

      // Save state to localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Return a stable reference to the setter function
  const setValue = (value) => {
    try {
      // Allow value to be a function (similar to useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};