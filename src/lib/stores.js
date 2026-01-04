import { writable } from 'svelte/store';

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const theme = writable(getInitialTheme());

// Update theme in localStorage and document
theme.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', value);
    document.documentElement.setAttribute('data-theme', value);
  }
});

