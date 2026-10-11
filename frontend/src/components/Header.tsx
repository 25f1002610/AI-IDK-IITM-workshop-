import React from 'react'
import { PanelLeft, Sun, Moon, Trash2, ExternalLink, Sparkles } from 'lucide-react'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
  onClearChat: () => void
  backendConnected: boolean
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  theme,
  toggleTheme,
  onClearChat,
  backendConnected,
}) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 px-4 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                Aster AI
              </span>
              <span className="hidden sm:inline-block rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
                Google ADK 2.11
              </span>
            </div>
            <div className="hidden sm:block text-[11px] text-[var(--text-muted)]">
              Search • Calculate • Understand
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Connection Status Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-mono text-[var(--text-secondary)] shadow-2xs">
          <span
            className={`h-2 w-2 rounded-full ${
              backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="hidden md:inline">
            {backendConnected ? 'ADK Agent Active' : 'Checking ADK...'}
          </span>
        </div>

        {/* Official ADK Web UI Link */}
        <a
          href="http://127.0.0.1:8000"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          title="Open Official Google ADK Web UI"
        >
          <span>Official ADK Web UI</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>

        {/* Clear Chat */}
        <button
          onClick={onClearChat}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-rose-500 transition-colors cursor-pointer"
          title="Clear Conversation"
          aria-label="Clear Conversation"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  )
}
