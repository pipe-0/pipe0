import { ExternalLink, Github, Terminal } from "lucide-react";

function convertGithubToCodesandbox(
  githubLink: string,
  filePath: string
): string {
  const codesandboxBaseUrl = "https://codesandbox.io/embed/github/";

  if (!githubLink.startsWith("https://github.com/")) {
    console.error(
      "Invalid GitHub link format. Please provide a link starting with 'https://github.com/'."
    );
    return "";
  }

  const githubRepoAndPath = githubLink.substring("https://github.com/".length);

  const encodedFilePath = encodeURIComponent(filePath);

  const codesandboxUrl = `${codesandboxBaseUrl}${githubRepoAndPath}?file=${encodedFilePath}&view=editor&module=${encodedFilePath}&hidenavigation=1&embed=1`;

  return codesandboxUrl;
}

export function SandboxPreview({
  githubLink,
  filePath,
}: {
  githubLink: string;
  filePath: string;
}) {
  const codeSandboxLink = convertGithubToCodesandbox(githubLink, filePath);
  return (
    <div>
      <div className="py-2 flex gap-5 pb-10">
        <a
          href={githubLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex gap-2 items-center"
        >
          <Github className="size-4" />
          <span className="text-primary underline">Check out on Github</span>
          <ExternalLink className="size-4" />
        </a>
        <a
          href={codeSandboxLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex gap-2 items-center"
        >
          <Terminal className="size-4" />
          <span className="tex-primary underline">Open in CodeSandbox</span>
          <ExternalLink className="size-4" />
        </a>
      </div>
      <iframe
        src={codeSandboxLink}
        title="CodeSandbox | pipe0 basic-script"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        className="w-full h-full min-h-[80dvh] overflow-hidden shadow-xl shadow-gray-700/20 bg-white dark:bg-black"
      ></iframe>
    </div>
  );
}
