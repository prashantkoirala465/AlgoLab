import { createHighlighter } from 'shiki';

// Cache highlighter instance across renders (module-level singleton)
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['cpp', 'javascript', 'python'],
    });
  }
  return highlighterPromise;
}

interface CodeBlockProps {
  code: string;
  lang: 'cpp' | 'javascript' | 'python';
  theme?: 'light' | 'dark';
}

export async function CodeBlock({ code, lang, theme = 'light' }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: theme === 'dark' ? 'github-dark' : 'github-light',
  });

  return (
    <div
      className="rounded-lg overflow-auto text-sm leading-relaxed font-[var(--font-mono)] [&_pre]:p-4 [&_pre]:!bg-transparent"
      style={{ background: theme === 'dark' ? '#0d1117' : '#f6f8fa' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
