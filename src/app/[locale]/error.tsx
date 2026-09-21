"use client";

import { useEffect } from "react";

// A chunk 404 after a redeploy is not a bug in this build. Vercel serves the
// chunks of the deployment that is live now; a tab that was loaded before the
// redeploy still holds the old webpack runtime, so its next dynamic import
// (the map and the charts on the dashboard are both `next/dynamic`) asks for a
// filename that no longer exists. Without a boundary this reaches the user as
// "Application error: a client-side exception has occurred", which reads like
// the app is broken when a reload would have fixed it.
//
// So: reload once, and only once. The flag is what stops a genuinely broken
// build from turning into a refresh loop — if the fresh page throws the same
// error again, the second pass falls through to the retry UI below.
const RELOADED_KEY = "chunk-error-reloaded";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module/i.test(
      error.message,
    )
  );
}

// sessionStorage throws in a private window and in some embedded webviews, and
// a storage failure must not swallow the error page itself.
function readFlag(): boolean {
  try {
    return sessionStorage.getItem(RELOADED_KEY) === "1";
  } catch {
    return true; // cannot remember a reload, so do not risk looping
  }
}

function writeFlag(): void {
  try {
    sessionStorage.setItem(RELOADED_KEY, "1");
  } catch {
    /* nothing to do: readFlag already refuses to reload without storage */
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isChunkLoadError(error) && !readFlag()) {
      writeFlag();
      window.location.reload();
      return;
    }
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="max-w-md text-slate-400">
        {isChunkLoadError(error)
          ? "The app was updated while this page was open. Reload to get the new version."
          : "This page failed to load. Try again, and if it keeps happening the error details are in the browser console."}
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.removeItem(RELOADED_KEY);
          } catch {
            /* ignore */
          }
          isChunkLoadError(error) ? window.location.reload() : reset();
        }}
        className="rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
      >
        {isChunkLoadError(error) ? "Reload" : "Try again"}
      </button>
    </div>
  );
}
