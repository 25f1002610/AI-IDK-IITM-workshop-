import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Sparkles, User } from 'lucide-react'
import type { Message } from '../types'
import { ToolCard } from './ToolCards'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  // Format assistant markdown text simply and cleanly
  const renderFormattedContent = (content: string) => {
    // Split by lines to render headers, blockquotes, lists, and code
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="mt-3 mb-1 text-base font-bold text-[var(--text-primary)]">
            {line.replace('### ', '')}
          </h3>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="mt-4 mb-2 text-lg font-bold text-[var(--text-primary)]">
            {line.replace('## ', '')}
          </h2>
        )
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-2 border-l-2 border-[var(--text-muted)] pl-3 text-xs italic text-[var(--text-secondary)]">
            {line.replace('> ', '')}
          </blockquote>
        )
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-[var(--text-primary)] leading-relaxed">
            {renderInlineMarkdown(line.replace('- ', ''))}
          </li>
        )
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />
      }
      return (
        <p key={idx} className="text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">
          {renderInlineMarkdown(line)}
        </p>
      )
    })
  }

  // Simple inline markdown for bold (**text**) and code (`text`)
  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-subtle)]">
            {part.slice(1, -1)}
          </code>
        )
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-[var(--text-primary)]">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full gap-3 py-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] shadow-xs">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div className={`relative flex flex-col max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {isUser ? (
          <div className="rounded-2xl rounded-tr-xs bg-[var(--accent)] px-4 py-3 text-sm sm:text-base text-[var(--bg-primary)] shadow-xs">
            {message.content}
          </div>
        ) : (
          <div className="w-full rounded-2xl rounded-tl-xs border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 shadow-xs">
            {/* Tool Execution Cards */}
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="mb-4 space-y-2">
                {message.toolCalls.map((tc, idx) => (
                  <ToolCard key={idx} toolCall={tc} />
                ))}
              </div>
            )}

            {/* Markdown Text Response */}
            <div className="space-y-1">
              {renderFormattedContent(message.content)}
            </div>

            {/* Response Footer / Copy Button */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-muted)]">
              <span className="font-mono text-[11px]">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-xs">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  )
}
