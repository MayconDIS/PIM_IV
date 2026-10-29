import React from 'react';

/** Robô Tutor escolhido para o Nexor: o capelo cobre o topo da cabeça. */
export function IconeNexor() {
  return (
    <svg className="icone-nexor" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      <path d="M18 25C14 27 12 30 12 35v10c0 6 5 11 11 11h18c6 0 11-5 11-11V35c0-5-2-8-6-10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12 34H7v10h5m40-10h5v10h-5" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <rect x="17" y="34" width="12" height="10" rx="4" stroke="currentColor" strokeWidth="2.7" />
      <rect x="35" y="34" width="12" height="10" rx="4" stroke="currentColor" strokeWidth="2.7" />
      <path d="M29 38h6m-9 12h12" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
      <path d="M18 18v7q14 8 28 0v-7Z" className="nexor-chapeu" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m5 13 27-9 27 9-27 10-27-10Z" className="nexor-chapeu" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M58 14v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
