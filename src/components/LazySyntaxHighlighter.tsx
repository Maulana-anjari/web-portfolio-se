import { Suspense, lazy } from "react";

const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter").then((m) => ({ default: m.Prism }))
);

let vscDarkPlus: any = null;
function getStyle() {
  if (!vscDarkPlus) {
    import("react-syntax-highlighter/dist/esm/styles/prism").then((m) => {
      vscDarkPlus = m.vscDarkPlus;
    });
  }
  return vscDarkPlus;
}

interface Props {
  language: string;
  code: string;
  isAlgorithm?: boolean;
}

function HighlighterFallback({ code, isAlgorithm }: { code: string; isAlgorithm?: boolean }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: "1.5rem",
        backgroundColor: isAlgorithm ? "#0a1f14" : "#0F0F0F",
        fontSize: "13px",
        lineHeight: "1.6",
        fontFamily: '"JetBrains Mono", monospace',
        color: isAlgorithm ? "#D1FAE5" : "#D4D4D4",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

export default function LazySyntaxHighlighter({ language, code, isAlgorithm }: Props) {
  getStyle();

  return (
    <Suspense fallback={<HighlighterFallback code={code} isAlgorithm={isAlgorithm} />}>
      <SyntaxHighlighter
        language={isAlgorithm ? "plaintext" : language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          backgroundColor: isAlgorithm ? "#0a1f14" : "#0F0F0F",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
        codeTagProps={{
          style: {
            fontFamily: '"JetBrains Mono", monospace',
            color: isAlgorithm ? "#D1FAE5" : undefined,
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Suspense>
  );
}
