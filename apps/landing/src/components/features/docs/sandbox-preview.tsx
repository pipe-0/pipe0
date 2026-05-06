import { AlertTriangle, ExternalLink, Github, Terminal } from "lucide-react";

type SandboxProvider = "codesandbox" | "stackblitz";

function getRepoAndPath(githubLink: string): string | null {
  if (!githubLink.startsWith("https://github.com/")) {
    console.error(
      "Invalid GitHub link format. Please provide a link starting with 'https://github.com/'."
    );
    return null;
  }
  return githubLink.substring("https://github.com/".length);
}

function convertGithubToCodesandbox(
  githubLink: string,
  filePath: string
): string {
  const repoAndPath = getRepoAndPath(githubLink);
  if (!repoAndPath) return "";
  const encodedFilePath = encodeURIComponent(filePath);
  return `https://codesandbox.io/embed/github/${repoAndPath}?file=${encodedFilePath}&view=editor&module=${encodedFilePath}&hidenavigation=1&embed=1`;
}

function convertGithubToStackblitz(
  githubLink: string,
  filePath: string
): string {
  const repoAndPath = getRepoAndPath(githubLink);
  if (!repoAndPath) return "";
  // StackBlitz uses the file path without a leading slash.
  const file = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const encodedFile = encodeURIComponent(file);
  return `https://stackblitz.com/github/${repoAndPath}?embed=1&file=${encodedFile}&view=preview&hideNavigation=1`;
}

export function SandboxPreview({
  githubLink,
  filePath,
  provider = "codesandbox",
}: {
  githubLink: string;
  filePath: string;
  provider?: SandboxProvider;
}) {
  const embedUrl =
    provider === "stackblitz"
      ? convertGithubToStackblitz(githubLink, filePath)
      : convertGithubToCodesandbox(githubLink, filePath);

  const providerLabel =
    provider === "stackblitz" ? "Open in StackBlitz" : "Open in CodeSandbox";
  const iframeTitle =
    provider === "stackblitz"
      ? "StackBlitz | pipe0 example"
      : "CodeSandbox | pipe0 example";

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
          href={embedUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex gap-2 items-center"
        >
          <Terminal className="size-4" />
          <span className="tex-primary underline">{providerLabel}</span>
          <ExternalLink className="size-4" />
        </a>
      </div>
      {provider === "stackblitz" && (
        <div className="mb-4 flex items-start gap-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span>
            StackBlitz runs the dev server in WebContainers, which works
            reliably in Chrome only. Firefox and Safari support is in beta and
            the preview may render blank — open this page in Chrome to try the
            example.
          </span>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={iframeTitle}
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        className="w-full h-full min-h-[80dvh] overflow-hidden shadow-xl shadow-gray-700/20 bg-white dark:bg-black"
      ></iframe>
    </div>
  );
}
