declare module 'react-markdown' {
  import type React from 'react';
  
  interface ReactMarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
    children: string;
    components?: Record<string, React.ComponentType<any>>;
    [key: string]: any;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
  export const Markdown: React.FC<ReactMarkdownProps>;
}
