import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface CopyCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

type CopyStatus = "idle" | "copied" | "error";

const LANGUAGE_ALIASES: Record<string, string> = {
  "c++": "cpp",
  htm: "html",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
};

// These styles intentionally live with the component. A published package cannot
// assume that its consumer has Tailwind installed or that Tailwind scans
// node_modules for utility classes.
const styles: Record<string, CSSProperties> = {
  container: {
    overflow: "hidden",
    border: "1px solid #334155",
    borderRadius: "0.75rem",
    background: "#020617",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.625rem 1rem",
    borderBottom: "1px solid #334155",
    background: "#0f172a",
    color: "#f1f5f9",
    fontSize: "0.875rem",
  },
  filename: { overflow: "hidden", color: "#f1f5f9", fontWeight: 500, textOverflow: "ellipsis", whiteSpace: "nowrap" },
  language: {
    padding: "0.125rem 0.5rem",
    borderRadius: "0.25rem",
    background: "#1e293b",
    color: "#cbd5e1",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "0.75rem",
  },
  button: {
    marginLeft: "auto",
    padding: "0.375rem 0.75rem",
    border: "1px solid #475569",
    borderRadius: "0.375rem",
    background: "transparent",
    color: "#f1f5f9",
    cursor: "pointer",
    font: "inherit",
    fontWeight: 500,
  },
  codeContainer: { overflowX: "auto" },
};

function normalizeLanguage(language: string) {
  return LANGUAGE_ALIASES[language.toLowerCase()] ?? language.toLowerCase();
}

/** A highlighted, scrollable code block with a Clipboard API copy action. */
export function CopyCodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  className,
}: CopyCodeBlockProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedLanguage = normalizeLanguage(language);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      // Clipboard access can be unavailable outside a secure context or denied by the user.
      setCopyStatus("error");
    }

    resetTimer.current = setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const buttonText =
    copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy";

  return (
    <section
      className={className}
      style={styles.container}
    >
      <header style={styles.header}>
        {filename && <span style={styles.filename}>{filename}</span>}
        <span style={styles.language}>
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyStatus === "idle" ? "Copy code to clipboard" : buttonText}
          style={styles.button}
        >
          {buttonText}
        </button>
      </header>

      <div style={styles.codeContainer} aria-label={`${language} source code`}>
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          wrapLines
          wrapLongLines={false}
          codeTagProps={{ style: { display: "block", padding: 0, whiteSpace: "pre" } }}
          lineProps={{ style: { display: "block" } }}
          customStyle={{
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.625",
            margin: 0,
            minWidth: "max-content",
            padding: "1rem",
          }}
          lineNumberStyle={{ color: "#64748b", minWidth: "2.5em", paddingRight: "1.25em" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

export default CopyCodeBlock;
