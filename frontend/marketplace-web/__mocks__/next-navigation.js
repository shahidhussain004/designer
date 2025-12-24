const React = require('react');

function useRouter() {
  return { push: () => {}, replace: () => {}, prefetch: () => {} };
}

function useSearchParams() {
  return { get: () => null };
}

function usePathname() {
  return '/';
}

const MemoryRouterProvider = ({ children }) => React.createElement(React.Fragment, null, children);

module.exports = {
  useRouter,
  useSearchParams,
  usePathname,
  MemoryRouterProvider,
};
