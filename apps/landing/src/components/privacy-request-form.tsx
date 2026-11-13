import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";

/** The request types core accepts (PRIVACY_REQUEST_TYPES in its privacy-requests route). */
const requestTypes = [
  {
    value: "opt_out",
    label: "Opt out: I object to pipe0's customers using my details",
  },
  {
    value: "access",
    label: "Access: tell me who retrieved my details and where they came from",
  },
  { value: "deletion", label: "Deletion: have my details deleted" },
  { value: "other", label: "Something else" },
] as const;

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "sent"; email: string }
  | { type: "failed" };

/** The look of `Input`, for the select and the textarea it has no component for. */
const field =
  "border-input placeholder:text-muted-foreground w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm";

/**
 * The form a person uses when a pipe0 customer looked up their details
 * (privacy policy, section 6A). It posts to core, which emails the request to
 * pipe0. Nothing is stored on this site.
 */
export function PrivacyRequestForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const email = text("email");
    const optional = (name: string) => (text(name) ? { [name]: text(name) } : {});

    setStatus({ type: "sending" });
    try {
      const res = await fetch(`${appInfo.links.apiUrl}/v1/privacy-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_type: text("request_type"),
          full_name: text("full_name"),
          email,
          ...optional("profile_url"),
          ...optional("message"),
          ...optional("website"),
        }),
      });
      setStatus(res.ok ? { type: "sent", email } : { type: "failed" });
    } catch {
      setStatus({ type: "failed" });
    }
  }

  if (status.type === "sent") {
    return (
      <div
        role="status"
        className="mx-auto max-w-xl rounded-[18px] border border-border bg-card p-6 sm:p-8"
      >
        <h2 className="text-[20px] font-medium tracking-[-0.03em] text-foreground">
          Request sent
        </h2>
        <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">
          We reply to {status.email} within one month.
        </p>
      </div>
    );
  }

  const sending = status.type === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-6 rounded-[18px] border border-border bg-card p-6 sm:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="privacy-request-type">What do you want to do?</Label>
        <select
          id="privacy-request-type"
          name="request_type"
          required
          defaultValue="opt_out"
          className={cn(field, "h-9 py-1")}
        >
          {requestTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="privacy-request-name">Full name</Label>
        <Input
          id="privacy-request-name"
          name="full_name"
          required
          maxLength={200}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="privacy-request-email">Email address</Label>
        <Input
          id="privacy-request-email"
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          We reply here, and look for this address in what our customers
          retrieved.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="privacy-request-profile">
          LinkedIn profile URL (optional)
        </Label>
        <Input
          id="privacy-request-profile"
          name="profile_url"
          type="url"
          maxLength={500}
          placeholder="https://www.linkedin.com/in/your-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="privacy-request-message">Details (optional)</Label>
        <textarea
          id="privacy-request-message"
          name="message"
          rows={4}
          maxLength={4000}
          className={field}
        />
        <p className="text-xs text-muted-foreground">
          Other email addresses of yours, or the message that made you look for
          us.
        </p>
      </div>

      {/* Hidden from people; only a bot fills it, and core then sends nothing. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="privacy-request-website">Website</label>
        <input
          id="privacy-request-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-3">
        <Button type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send request"}
        </Button>
        <p aria-live="polite" className="text-sm text-destructive">
          {status.type === "failed" && (
            <>
              That did not go through. Email{" "}
              <a className="underline" href={`mailto:${appInfo.emails.privacy}`}>
                {appInfo.emails.privacy}
              </a>{" "}
              instead.
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          We use what you enter only to handle your request.
        </p>
      </div>
    </form>
  );
}
