import { Suspense, lazy } from "react";

interface Props {
  language: string;
  code: string;
  isAlgorithm?: boolean;
}

const HighlightedCode = lazy(() =>
  Promise.all([
    import("react-syntax-highlighter/dist/esm/prism-light"),
    import("react-syntax-highlighter/dist/esm/languages/prism/python"),
    import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
    import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
    import("react-syntax-highlighter/dist/esm/languages/prism/go"),
    import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
    import("react-syntax-highlighter/dist/esm/languages/prism/json"),
    import("react-syntax-highlighter/dist/esm/languages/prism/sql"),
    import("react-syntax-highlighter/dist/esm/languages/prism/yaml"),
    import("react-syntax-highlighter/dist/esm/languages/prism/docker"),
    import("react-syntax-highlighter/dist/esm/styles/prism/one-dark"),
  ]).then(
    ([
      prism,
      py,
      js,
      ts,
      go,
      bash,
      json,
      sql,
      yaml,
      docker,
      style,
    ]) => {
      const SyntaxHighlighter = prism.default;
      SyntaxHighlighter.registerLanguage("python", py.default);
      SyntaxHighlighter.registerLanguage("javascript", js.default);
      SyntaxHighlighter.registerLanguage("typescript", ts.default);
      SyntaxHighlighter.registerLanguage("go", go.default);
      SyntaxHighlighter.registerLanguage("bash", bash.default);
      SyntaxHighlighter.registerLanguage("json", json.default);
      SyntaxHighlighter.registerLanguage("sql", sql.default);
      SyntaxHighlighter.registerLanguage("yaml", yaml.default);
      SyntaxHighlighter.registerLanguage("dockerfile", docker.default);

      function Component({ language, code, isAlgorithm }: Props) {
        const lang = isAlgorithm ? "plaintext" : language;
        return (
          <SyntaxHighlighter
            language={lang}
            style={style.default}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              backgroundColor: isAlgorithm ? "#0a1f14" : "#0F0F0F",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "13px",
              lineHeight: "1.6",
            }}
            codeTagProps={{
              style: {
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "13px",
                lineHeight: "1.6",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        );
      }
      return { default: Component };
    },
  ),
);

function PlainFallback({
  code,
  isAlgorithm,
}: {
  code: string;
  isAlgorithm?: boolean;
}) {
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
        overflowX: "auto",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

export default function LazySyntaxHighlighter(props: Props) {
  return (
    <Suspense
      fallback={
        <PlainFallback code={props.code} isAlgorithm={props.isAlgorithm} />
      }
    >
      <HighlightedCode {...props} />
    </Suspense>
  );
}
