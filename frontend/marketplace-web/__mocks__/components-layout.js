const React = require('react');

module.exports = {
  Navbar: function Navbar() { return React.createElement('div', null, 'Navbar'); },
  Footer: function Footer() { return React.createElement('div', null, 'Footer'); },
  PageLayout: function PageLayout({ children }) { return React.createElement('div', null, children); },
  ClientOnly: function ClientOnly({ children }) { return React.createElement(React.Fragment, null, children); }
};
