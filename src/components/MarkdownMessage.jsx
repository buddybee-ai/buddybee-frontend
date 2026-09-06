import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import rehypeKatex from 'rehype-katex'
import { normalizeMathDelimiters } from '../utils/mathDelimiters'

// Renders a chat message's text as real Markdown — bold/italic, lists,
// links, code, tables — with LaTeX math (both \( \) / \[ \] and $ / $$
// delimiters) typeset by KaTeX instead of shown as literal source text.
// This is what fixed formulas like `\[ a^3+b^3=(a+b)(a^2-ab+b^2) \]`
// rendering as raw escaped text in the chat.
export default function MarkdownMessage({ text, isUser = false }) {
  const normalized = normalizeMathDelimiters(text || '')

  return (
    <div className={`chat-markdown ${isUser ? 'chat-markdown-user' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Links always open in a new tab and never break bubble layout.
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  )
}
