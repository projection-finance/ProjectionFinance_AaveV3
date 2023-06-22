import React, { useState,useEffect } from 'react';
const AlchemyBadge = (props) => {
  const BADGE_ID = '23f803b181e43f1a';
  const ALCHEMY_URL = `https://alchemyapi.io/?r=badge:${BADGE_ID}`;
  const ALCHEMY_ANALYTICS_URL = `https://analytics.alchemyapi.io/analytics`;

  useEffect(() => {
    const logBadgeView = () => {
      fetch(`${ALCHEMY_ANALYTICS_URL}/badge-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          badge_id: BADGE_ID,
        }),
      });
    };

    const isBadgeInViewpoint = (bounding) => {
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    const intervalId = setInterval(() => {
      const badge = document.getElementById('badge-button');
      if (badge && isBadgeInViewpoint(badge.getBoundingClientRect())) {
        logBadgeView();
        clearInterval(intervalId);
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const logBadgeClick = () => {
    fetch(`${ALCHEMY_ANALYTICS_URL}/badge-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        badge_id: BADGE_ID,
      }),
    });
    window.open(ALCHEMY_URL, '_blank').focus();
  };

  return (
    <a href="#" onClick={e => { e.preventDefault(); logBadgeClick(); }}>
      <img
        id="badge-button"
        style={{ width: 200, height: 44.17 }}
        src={`https://static.alchemyapi.io/images/marketing/badge${props.color === 'light' ? 'Light' : ''}.png`}
        alt={`Alchemy Supercharged ${props.color}`}
      />
    </a>
  );
};

export default AlchemyBadge;
