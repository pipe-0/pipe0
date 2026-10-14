'use client';
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type SyntheticEvent,
  use,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import { Loader2, RefreshCw, SearchIcon, Send, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { type UseChatHelpers } from '@ai-sdk/react';
import { type Tool, type UIMessage, type UIToolInvocation } from 'ai';
import { Markdown } from './markdown';
import { Presence } from '@radix-ui/react-presence';
import { useAskAiContext } from './ask-ai-provider';

export type ChatUIMessage = UIMessage<
  never,
  {
    client: {
      location: string;
    };
  }
>;

type DocsTool = Tool<{ query?: string; url?: string }>;

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<ChatUIMessage>;
} | null>(null);

export function AISearchPanelHeader({ className, ...props }: ComponentProps<'div'>) {
  const { setOpen } = useAISearchContext();

  return (
    <div
      className={cn(
        'sticky top-0 flex items-start gap-2 border-b border-(--rule,var(--color-fd-border)) pb-2',
        className,
      )}
      {...props}
    >
      <div className="px-2 py-1 flex-1">
        <p className="text-[15px] font-medium">Ask AI</p>
        <p className="text-[13px] text-fd-muted-foreground">
          Answers come from the pipe0 docs. AI can be wrong, so check the linked pages.
        </p>
      </div>

      <button
        aria-label="Close"
        className={cn(
          buttonVariants({
            size: 'icon-sm',
            color: 'ghost',
            className: 'text-fd-muted-foreground rounded-full',
          }),
        )}
        onClick={() => setOpen(false)}
      >
        <X />
      </button>
    </div>
  );
}

export function AISearchInputActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === 'streaming';

  if (messages.length === 0) return null;

  return (
    <>
      {!isLoading && messages.at(-1)?.role === 'assistant' && (
        <button
          type="button"
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'rounded-full gap-1.5',
            }),
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      )}
      <button
        type="button"
        className={cn(
          buttonVariants({
            color: 'secondary',
            size: 'sm',
            className: 'rounded-full',
          }),
        )}
        onClick={() => setMessages([])}
      >
        Clear chat
      </button>
    </>
  );
}

const StorageKeyInput = '__ai_search_input';
export function AISearchInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState(() => localStorage.getItem(StorageKeyInput) ?? '');
  const isLoading = status === 'streaming' || status === 'submitted';
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (message.length === 0) return;

    void sendMessage({
      role: 'user',
      parts: [
        {
          type: 'data-client',
          data: {
            location: location.href,
          },
        },
        {
          type: 'text',
          text: message,
        },
      ],
    });
    setInput('');
    localStorage.removeItem(StorageKeyInput);
  };

  useEffect(() => {
    if (isLoading && canAutoFocus()) document.getElementById('nd-ai-input')?.focus();
  }, [isLoading]);

  return (
    <form {...props} className={cn('flex items-start pe-2', props.className)} onSubmit={onStart}>
      <Input
        value={input}
        placeholder={isLoading ? 'AI is answering...' : 'Ask a question'}
        autoFocus={canAutoFocus()}
        className="p-3"
        disabled={status === 'streaming' || status === 'submitted'}
        onChange={(e) => {
          setInput(e.target.value);
          localStorage.setItem(StorageKeyInput, e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event);
          }
        }}
      />
      {isLoading ? (
        <button
          key="bn"
          type="button"
          className={cn(
            buttonVariants({
              color: 'secondary',
              className: 'transition-all rounded-full mt-2 gap-2',
            }),
          )}
          onClick={stop}
        >
          <Square className="size-3 fill-current" />
          Stop
        </button>
      ) : (
        <button
          key="bn"
          type="submit"
          className={cn(
            buttonVariants({
              color: 'primary',
              className: 'transition-all rounded-full mt-2',
            }),
          )}
          disabled={input.length === 0}
        >
          <Send className="size-4" />
        </button>
      )}
    </form>
  );
}

/**
 * Focusing the input on a touch device raises the software keyboard, which
 * covers half the panel (and the starter questions) before the visitor has
 * decided to type. Only take focus where there is a physical keyboard.
 */
function canAutoFocus() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    function callback() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'instant',
      });
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn('fd-scroll-container overflow-y-auto min-w-0 flex flex-col', props.className)}
    >
      {props.children}
    </div>
  );
}

function Input(props: ComponentProps<'textarea'>) {
  const ref = useRef<HTMLDivElement>(null);
  const shared = cn('col-start-1 row-start-1', props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
          shared,
        )}
      />
      <div ref={ref} className={cn(shared, 'break-all invisible')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  );
}

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'pipe0',
};

function Thinking() {
  return (
    <p className="flex items-center gap-2 text-sm text-fd-muted-foreground">
      <Loader2 className="size-3.5 animate-spin" />
      Thinking…
    </p>
  );
}

function Message({
  message,
  pending = false,
  ...props
}: { message: ChatUIMessage; pending?: boolean } & ComponentProps<'div'>) {
  let markdown = '';
  const toolCalls: (UIToolInvocation<DocsTool> & { toolName: string })[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === 'text') {
      markdown += part.text;
      continue;
    }

    if (part.type.startsWith('tool-')) {
      const toolName = part.type.slice('tool-'.length);
      const p = part as UIToolInvocation<DocsTool>;

      if (!p.toolCallId) continue;
      toolCalls.push({ ...p, toolName });
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()} {...props}>
      <p
        className={cn(
          'mb-1 text-sm font-medium text-fd-muted-foreground',
          message.role === 'assistant' && 'text-fd-primary',
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      {toolCalls.length > 0 && (
        <div className="mb-2 flex flex-col gap-1">
          {toolCalls.map((call) => (
            <div
              key={call.toolCallId}
              className="flex min-w-0 items-center gap-1.5 text-xs text-fd-muted-foreground"
            >
              <SearchIcon className="size-3.5 shrink-0" />
              {call.state === 'output-error' || call.state === 'output-denied' ? (
                <p className="text-fd-error">{call.errorText ?? 'Search failed'}</p>
              ) : call.toolName === 'read_page' ? (
                <p className="truncate">
                  {call.output ? 'Read' : 'Reading'} {call.input?.url}
                </p>
              ) : (
                <p className="truncate">
                  {call.output ? 'Searched' : 'Searching'} the docs for “{call.input?.query}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {markdown.length > 0 ? (
        <div className="prose text-sm">
          <Markdown text={markdown} />
        </div>
      ) : (
        pending && <Thinking />
      )}
    </div>
  );
}

export function AISearch({ children }: { children: ReactNode }) {
  // Chat state (messages + open) is owned app-wide by AskAiProvider in the root
  // layout, so it persists across navigations instead of resetting per page.
  return <Context value={useAskAiContext()}>{children}</Context>;
}

export function AISearchTrigger({
  position = 'default',
  className,
  ...props
}: ComponentProps<'button'> & { position?: 'default' | 'float' }) {
  const { open, setOpen } = useAISearchContext();

  return (
    <button
      data-state={open ? 'open' : 'closed'}
      className={cn(
        position === 'float' && [
          'fixed bottom-6 gap-2 inset-e-[calc(--spacing(6)+var(--removed-body-scroll-bar-size,0px))] shadow-lg z-20 transition-[translate,opacity]',
          open && 'translate-y-10 opacity-0',
        ],
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {props.children}
    </button>
  );
}

/**
 * Mirror the visual viewport into `--vv-top` / `--vv-height` while the panel is
 * open.
 *
 * A `position: fixed` box is laid out against the *layout* viewport, and iOS
 * Safari does not shrink the layout viewport when the software keyboard opens —
 * only the visual viewport moves. So a panel pinned to `inset-y-4` keeps its
 * full height, the keyboard is drawn over the bottom of it, and the input the
 * keyboard was opened for is the exact thing it covers.
 *
 * `interactive-widget=resizes-content` (see app/layout.tsx) fixes this properly
 * on Chrome for Android by shrinking the layout viewport. Safari ignores it, so
 * below `lg` the panel sizes itself off these two properties instead. Reading
 * `offsetTop` as well as `height` matters: iOS scrolls the visual viewport up
 * to reveal a focused field, and without it the panel would stay behind.
 */
function useVisualViewportBounds(active: boolean) {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return;

    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty('--vv-top', `${vv.offsetTop}px`);
      root.style.setProperty('--vv-height', `${vv.height}px`);
    };
    apply();

    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      // Cleared rather than left behind, so the fallbacks in the class list
      // take over again once the panel closes.
      root.style.removeProperty('--vv-top');
      root.style.removeProperty('--vv-height');
    };
  }, [active]);
}

export function AISearchPanel({
  variant = 'docked',
}: {
  /**
   * `docked` slots the panel into the fumadocs docs grid's `toc` column.
   * `overlay` renders a fixed right-side drawer — use it on pages that are not
   * a fumadocs docs/notebook grid layout (e.g. the marketing site).
   */
  variant?: 'docked' | 'overlay';
}) {
  const { open, setOpen } = useAISearchContext();
  useHotKey();
  useVisualViewportBounds(open);

  return (
    <>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            translate: 100% 0;
          }
          to {
            translate: 0 0;
          }
        }
        @keyframes ask-ai-close {
          from {
            width: var(--ai-chat-width);
          }
          to {
            width: 0px;
          }
        }`}
      </style>
      <Presence present={open}>
        <div
          className={cn(
            'fixed inset-0 backdrop-blur-xs bg-fd-overlay',
            // Overlay drawer must sit above the marketing header (sticky z-50).
            variant === 'docked' ? 'z-30 lg:hidden' : 'z-[55]',
            open ? 'animate-fd-fade-in' : 'animate-fd-fade-out',
          )}
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            'overflow-hidden bg-fd-card text-fd-card-foreground [--ai-chat-width:400px] 2xl:[--ai-chat-width:460px]',
            // Below `lg` the panel is laid out against the visual viewport
            // rather than pinned with `inset-y-4`, so the keyboard cannot cover
            // the input (see useVisualViewportBounds). The fallbacks are the
            // old behaviour, for engines without `visualViewport`. The bottom
            // also clears the home indicator.
            'max-lg:fixed max-lg:inset-x-2 max-lg:border max-lg:rounded-2xl max-lg:shadow-xl',
            // Underscores rather than a bare `-`: CSS `calc()` needs whitespace
            // around its operators, and spelling that out here does not depend
            // on Tailwind choosing to insert it.
            'max-lg:top-[calc(var(--vv-top,0px)_+_1rem)]',
            'max-lg:h-[calc(var(--vv-height,100dvh)_-_2rem_-_env(safe-area-inset-bottom,0px))]',
            variant === 'docked'
              ? 'z-30 lg:sticky lg:top-0 lg:h-dvh lg:border-s lg:ms-auto lg:in-[#nd-docs-layout]:[grid-area:toc] lg:in-[#nd-notebook-layout]:row-span-full lg:in-[#nd-notebook-layout]:col-start-5'
              : 'z-[60] lg:fixed lg:inset-y-0 lg:right-0 lg:h-dvh lg:w-(--ai-chat-width) lg:border-l lg:shadow-xl',
            open
              ? 'animate-fd-dialog-in lg:animate-[ask-ai-open_200ms]'
              : 'animate-fd-dialog-out lg:animate-[ask-ai-close_200ms]',
          )}
        >
          <div className="flex flex-col size-full p-2 lg:p-3 lg:w-(--ai-chat-width)">
            <AISearchPanelHeader />
            <AISearchPanelList className="flex-1" />
            <div className="rounded-xl border bg-fd-secondary text-fd-secondary-foreground shadow-sm has-focus-visible:shadow-md">
              <AISearchInput />
              <div className="flex items-center gap-1.5 p-1 empty:hidden">
                <AISearchInputActions />
              </div>
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}

export function AISearchPanelList({ className, style, ...props }: ComponentProps<'div'>) {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');
  const busy = chat.status === 'submitted' || chat.status === 'streaming';

  return (
    <List
      className={cn('py-4 overscroll-contain', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
        ...style,
      }}
      {...props}
    >
      {messages.length === 0 ? (
        <Starters />
      ) : (
        <div className="flex flex-col px-3 gap-4">
          {messages.map((item, i) => (
            <Message
              key={item.id}
              message={item}
              pending={busy && i === messages.length - 1}
            />
          ))}
          {/* The first stream event can take a while (the model searches
              before it writes), so show the reply slot straight away. */}
          {busy && messages.at(-1)?.role === 'user' && (
            <div>
              <p className="mb-1 text-sm font-medium text-fd-primary">pipe0</p>
              <Thinking />
            </div>
          )}
          {chat.error && (
            <div className="p-2 bg-fd-secondary text-fd-secondary-foreground border rounded-lg">
              <p className="text-xs text-fd-muted-foreground mb-1">That didn’t work</p>
              <p className="text-sm">{chat.error.message}</p>
            </div>
          )}
        </div>
      )}
    </List>
  );
}

const starterQuestions = [
  'How do I find a work email from a name and company domain?',
  'What does a pipe cost, and when am I billed?',
  'How do I connect pipe0 to my agent over MCP?',
  'How do I chain two pipes in one request?',
];

function Starters() {
  const { sendMessage } = useChatContext();

  return (
    <div className="mt-auto flex flex-col gap-2 px-2" onClick={(e) => e.stopPropagation()}>
      <p className="px-1 text-[13px] font-medium text-fd-muted-foreground">Try asking</p>
      {starterQuestions.map((question) => (
        <button
          key={question}
          type="button"
          className="rounded-lg border border-(--rule,var(--color-fd-border)) px-3 py-2.5 text-left text-sm transition-colors hover:bg-fd-accent"
          onClick={() =>
            void sendMessage({
              role: 'user',
              parts: [
                { type: 'data-client', data: { location: location.href } },
                { type: 'text', text: question },
              ],
            })
          }
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export function useHotKey() {
  const { open, setOpen } = useAISearchContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    return () => window.removeEventListener('keydown', onKeyPress);
  }, []);
}

export function useAISearchContext() {
  return use(Context)!;
}

function useChatContext() {
  return use(Context)!.chat;
}
