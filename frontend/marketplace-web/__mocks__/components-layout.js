import React from 'react';

export function Navbar() { return React.createElement('div', null, 'Navbar'); }
export function Footer() { return React.createElement('div', null, 'Footer'); }
export function PageLayout({ children }: { children: React.ReactNode }) { return React.createElement('div', null, children); }
export function ClientOnly({ children }: { children: React.ReactNode }) { return React.createElement(React.Fragment, null, children); }
