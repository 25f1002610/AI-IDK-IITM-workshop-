import React, { useRef, useEffect } from 'react'
import { ArrowUp, Loader2, Search, Calculator, FileText } from 'lucide-react'

interface MessageComposerProps {
  input: string
  setInput: (value: string) => void
  onSend: (text: string) => void
  isLoading: boolean
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSend(input.trim())
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
    }
  }

  return (
    <div className="sticky bottom-0 z-10 w-full border-t border-[var(--border-color)] bg-[var(--bg-primary)]/85 px-4 pt-3 pb-5 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 shadow-xs transition-all focus-within:border-[var(--text-muted)] focus-within:shadow-md"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aster AI a question, request calculations, or paste text to analyze..."
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden disabled:opacity-50"
          />

          <div className="flex items-center justify-between px-2 pt-1 border-t border-[var(--border-subtle)]/60">
            {/* Quick Tool Capability Badges */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="hidden sm:inline-flex items-center gap-1">
                <Search className="h-3 w-3 text-[var(--tool-search-accent)]" />
                Search
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <Calculator className="h-3 w-3 text-[var(--tool-calc-accent)]" />
                Math
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <FileText className="h-3 w-3 text-[var(--tool-text-accent)]" />
                Analyze
              </span>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer shadow-xs"
              title="Send Message (Enter)"
              aria-label="Send Message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>

        <div className="mt-2 text-center text-[11px] text-[var(--text-muted)] font-mono">
          Aster AI uses Google ADK with safe AST math parsing and verified web grounding.
        </div>
      </div>
    </div>
  )
}
