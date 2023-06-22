import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const theme = 'dark'
  const router = useRouter();

  const [themeStatus, setThemeStatus] = useState();

  useEffect(() => {
    setThemeStatus(theme);
  }, [theme])

  return (
    <div id='theme-wrapper' className={`${themeStatus} ${router.pathname === '/' ? 'landing-page' : ''} ${router.pathname === '/auth/[[...path]]' ? 'h-screen' : ''}`}>
      {children}
    </div>
  );
}