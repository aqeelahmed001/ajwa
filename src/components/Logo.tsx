"use client";

import React from 'react';

export default function Logo({ width = 150, height = 60 }: { width?: number; height?: number }) {
  return (
    <div 
      style={{ 
        width, 
        height, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '24px',
        color: '#333',
        background: '#f0f0f0',
        borderRadius: '4px',
      }}
    >
      AJWA
    </div>
  );
}
