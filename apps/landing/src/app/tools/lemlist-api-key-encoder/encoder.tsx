"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Client-side Lemlist API key encoder. Lemlist uses HTTP Basic auth with an
 * empty username, so the value to encode is `:<apiKey>` (note the leading
 * colon). Everything runs in the browser — the key is never sent or stored.
 */
export function LemlistEncoder() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);

  // Lemlist expects an empty username, so the encoded value is `:<apiKey>`.
  // Strip any leading colons the user may have pasted, then add exactly one.
  // API keys are ASCII, so btoa is safe here.
  const key = apiKey.replace(/^:+/, "");
  const encoded = key ? btoa(`:${key}`) : "";

  async function handleCopy() {
    if (!encoded) return;
    try {
      await navigator.clipboard.writeText(encoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context) — fail quietly.
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[18px] border border-border bg-card p-6 sm:p-8">
      <div className="space-y-2">
        <Label htmlFor="lemlist-api-key">Lemlist API key</Label>
        <Input
          id="lemlist-api-key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="Paste your Lemlist API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Paste your key <b>without</b> the colon. Encoded locally in your
          browser; your key is never sent or stored.
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="lemlist-encoded">Encoded API key (base64)</Label>
        <div className="flex items-stretch gap-2">
          <code
            id="lemlist-encoded"
            className="flex min-h-9 flex-1 items-center overflow-x-auto rounded-md border border-input bg-muted/40 px-3 py-1 font-mono text-sm break-all text-foreground"
          >
            {encoded || (
              <span className="text-muted-foreground">
                Your encoded key will appear here
              </span>
            )}
          </code>
          <Button
            type="button"
            variant="default"
            onClick={handleCopy}
            disabled={!encoded}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use it as{" "}
          <code className="font-mono">Authorization: Basic &lt;encoded&gt;</code>{" "}
          in your API requests.
        </p>
      </div>
    </div>
  );
}
