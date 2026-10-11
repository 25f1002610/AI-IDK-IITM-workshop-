import React from 'react'
import { motion } from 'framer-motion'
import { Search, Calculator, FileText, CheckCircle2, AlertCircle, ExternalLink, Cpu } from 'lucide-react'
import type { ToolCall } from '../types'

interface ToolCardProps {
  toolCall: ToolCall
}

export const ToolCard: React.FC<ToolCardProps> = ({ toolCall }) => {
  const { tool, input, output, status, sources } = toolCall

  if (tool === 'google_search') {
    const query = input?.query || 'Web Search'
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="my-3 rounded-xl border border-[var(--tool-search-border)] bg-[var(--tool-search-bg)] p-4 text-sm shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-[var(--tool-search-accent)]">
            <Search className="h-4 w-4" />
            <span>Google Search</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-[var(--tool-search-accent)] font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Grounded Result
          </span>
        </div>

        <div className="mt-2 text-xs text-[var(--text-secondary)] font-mono">
          Query: <span className="font-semibold text-[var(--text-primary)]">"{query}"</span>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[var(--tool-search-border)]/60">
            {sources.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-[var(--bg-card)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors"
              >
                <span>{s.title}</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            ))}
          </div>
        )}
      </motion.div>
    )
  }

  if (tool === 'calculator_tool') {
    const expr = input?.expression || ''
    const result = output?.result
    const isError = status === 'error' || output?.status === 'error'
    const errorMsg = output?.message || 'Calculation error'

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="my-3 rounded-xl border border-[var(--tool-calc-border)] bg-[var(--tool-calc-bg)] p-4 text-sm shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-[var(--tool-calc-accent)]">
            <Calculator className="h-4 w-4" />
            <span>Calculator Tool</span>
            <span className="rounded bg-[var(--tool-calc-border)]/40 px-1.5 py-0.5 text-[10px] font-mono">AST Parser</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-[var(--tool-calc-accent)] font-mono">
            {isError ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                <span className="text-rose-500 font-semibold">Evaluation Error</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Exact Numerical
              </>
            )}
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between rounded-lg bg-[var(--bg-card)]/80 border border-[var(--tool-calc-border)]/60 px-3 py-2 font-mono">
          <div className="text-xs text-[var(--text-secondary)]">
            expr: <code className="text-[var(--text-primary)] font-semibold">{expr}</code>
          </div>
          {!isError && (
            <div className="text-base font-bold text-[var(--tool-calc-accent)]">
              = {result !== undefined ? String(result) : ''}
            </div>
          )}
        </div>

        {isError && (
          <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-mono">
            {errorMsg}
          </div>
        )}
      </motion.div>
    )
  }

  if (tool === 'text_analyzer_tool') {
    const chars = output?.characters ?? 0
    const words = output?.words ?? 0
    const sentences = output?.sentences ?? 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="my-3 rounded-xl border border-[var(--tool-text-border)] bg-[var(--tool-text-bg)] p-4 text-sm shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-[var(--tool-text-accent)]">
            <FileText className="h-4 w-4" />
            <span>Text Analyzer</span>
            <span className="rounded bg-[var(--tool-text-border)]/40 px-1.5 py-0.5 text-[10px] font-mono">Rule-based</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-[var(--tool-text-accent)] font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Metrics
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono">
          <div className="rounded-lg bg-[var(--bg-card)]/80 border border-[var(--tool-text-border)]/60 p-2">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Characters</div>
            <div className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{chars}</div>
          </div>
          <div className="rounded-lg bg-[var(--bg-card)]/80 border border-[var(--tool-text-border)]/60 p-2">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Words</div>
            <div className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{words}</div>
          </div>
          <div className="rounded-lg bg-[var(--bg-card)]/80 border border-[var(--tool-text-border)]/60 p-2">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Sentences</div>
            <div className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{sentences}</div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Fallback for general tool execution
  return (
    <div className="my-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-3 text-xs font-mono">
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Cpu className="h-4 w-4" />
        <span>Tool: {tool} ({status})</span>
      </div>
    </div>
  )
}
