// BuddyBee's AI tutor (and many LLMs generally) writes math using the
// LaTeX-style delimiters \( ... \) for inline math and \[ ... \] for
// display/block math. remark-math (the plugin that actually finds and
// hands math off to KaTeX) only recognises the $ ... $ / $$ ... $$
// syntax out of the box. Without this conversion, a reply like
// `\[ a^3+b^3=(a+b)(a^2-ab+b^2) \]` renders as that exact literal text
// instead of a typeset equation — which was the original bug.
//
// This does a plain, careful string substitution *before* the text is
// handed to react-markdown. It intentionally does not touch text inside
// fenced code blocks (``` ... ```) or inline code (`...`), since a
// literal "\(" inside a code sample should stay literal text, not be
// reinterpreted as math.

const CODE_FENCE_OR_SPAN = /(```[\s\S]*?```|`[^`\n]*`)/g;

function convertDelimiters(segment) {
  return segment
    // Display math: \[ ... \] -> $$ ... $$
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `$$${inner}$$`)
    // Inline math: \( ... \) -> $ ... $
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner}$`);
}

export function normalizeMathDelimiters(text) {
  if (!text || (text.indexOf('\\(') === -1 && text.indexOf('\\[') === -1)) {
    // Fast path: nothing to convert, and we skip the code-fence split
    // entirely so plain chat messages (the overwhelming majority) pay
    // zero extra cost.
    return text;
  }

  // Split on code fences/spans, converting only the non-code segments so
  // code samples are never mistaken for LaTeX.
  return text
    .split(CODE_FENCE_OR_SPAN)
    .map((segment, i) => (i % 2 === 1 ? segment : convertDelimiters(segment)))
    .join('');
}
