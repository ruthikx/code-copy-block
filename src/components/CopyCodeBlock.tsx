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
      className={[
        "overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="flex items-center gap-3 border-b border-slate-700 bg-slate-900 px-4 py-2.5 text-sm">
        {filename && <span className="truncate font-medium text-slate-100 gap-2">{filename}</span>}
        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyStatus === "idle" ? "Copy code to clipboard" : buttonText}
          className="ml-auto rounded-md border border-slate-600 px-3 py-1.5 font-medium text-slate-100 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </header>

      <div className="overflow-x-auto" aria-label={`${language} source code`}>
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
