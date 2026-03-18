import CopyCodeButton from "./CopyCodeButton";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language || "code"}</span>
        <CopyCodeButton code={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
