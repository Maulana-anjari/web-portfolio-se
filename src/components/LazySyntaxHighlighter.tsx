interface Props {
  language: string;
  code: string;
  isAlgorithm?: boolean;
}

export default function LazySyntaxHighlighter({ language, code, isAlgorithm }: Props) {
  return (
    <pre
      data-language={isAlgorithm ? "plaintext" : language}
      className="overflow-x-auto"
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
