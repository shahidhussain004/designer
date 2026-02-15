declare module 'react-markdown' {
  import type React from 'react';
  
  interface ReactMarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    components?: Record<string, React.ComponentType<unknown>>;
    [key: string]: unknown;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
  export const Markdown: React.FC<ReactMarkdownProps>;
}
