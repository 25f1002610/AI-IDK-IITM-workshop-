import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Trash2, Cpu, Sparkles, X, Sun, Moon } from 'lucide-react'
import type { Conversation } from '../types'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  conversations: Conversation[]
  currentId: string
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  setOpen,
  conversations,
  currentId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  theme,
  toggleTheme,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[var(--border-color)] bg-[var(--bg-secondary)] transition-transform duration-300 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:-ml-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-color)] px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="font-editorial text-lg font-bold tracking-tight text-[var(--text-primary)]">
              Aster AI
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] md:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="flex w-full items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-2xs hover:bg-[var(--bg-card-hover)] hover:border-[var(--text-muted)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-[var(--text-secondary)]" />
              <span>New Conversation</span>
            </div>
            <span className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
              ⌘N
            </span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="px-2 pb-1 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Recent Sessions
          </div>

          {conversations.length === 0 ? (
            <div className="px-2 py-4 text-xs text-[var(--text-muted)] italic text-center">
              No recent conversations
            </div>
          ) : (
            conversations.map((conv) => {
              const active = conv.id === currentId
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--bg-card)] font-medium text-[var(--text-primary)] border border-[var(--border-color)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/60 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate text-xs">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conv.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 rounded p-1 hover:text-rose-500 transition-opacity cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Model Spec Card */}
        <div className="p-3 border-t border-[var(--border-color)]">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 text-xs shadow-2xs">
            <div className="flex items-center justify-between text-[var(--text-muted)] font-mono text-[10px]">
              <span>ROOT AGENT</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <div className="mt-1 font-semibold text-[var(--text-primary)] text-xs">
              personal_assistant
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-mono">
              <Cpu className="h-3.5 w-3.5" />
              <span>gemini-2.5-flash</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border-color)] p-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center font-bold text-[10px]">
              IITM
            </div>
            <div>
              <div className="font-medium text-[var(--text-primary)] text-xs">Candidate</div>
              <div className="text-[10px] text-[var(--text-muted)]">Workshop Certification</div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </aside>
    </>
  )
}
