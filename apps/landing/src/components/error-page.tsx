/** What a failed route renders; the document shell around it stays intact. */
export function ErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center text-sm">
      <h1 className="border-r border-[var(--rule)] pr-5 text-2xl font-medium">
        Error
      </h1>
      <p className="pl-5">
        Something went wrong.{" "}
        <a className="underline" href="">
          Reload the page
        </a>
      </p>
    </main>
  );
}
