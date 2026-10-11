import React from 'react'
import { motion } from 'framer-motion'
import { Search, Calculator, FileText, Sparkles, ArrowUpRight } from 'lucide-react'

interface WelcomeViewProps {
  onSelectPrompt: (prompt: string) => void
}

const EXAMPLE_PROMPTS = [
  {
    icon: Search,
    category: 'Google Search',
    tag: 'Web Grounding',
    prompt: 'Find the latest developments in AI agents.',
    color: 'var(--tool-search-accent)',
    bg: 'var(--tool-search-bg)',
    border: 'var(--tool-search-border)',
  },
  {
    icon: Calculator,
    category: 'Calculator',
    tag: 'Safe AST Math',
    prompt: 'Calculate 18% GST on ₹25,000.',
    color: 'var(--tool-calc-accent)',
    bg: 'var(--tool-calc-bg)',
    border: 'var(--tool-calc-border)',
  },
  {
    icon: FileText,
    category: 'Text Analyzer',
    tag: 'Word & Sentence Count',
    prompt: 'Analyze this paragraph and count its words: Google ADK helps developers build AI agents.',
    color: 'var(--tool-text-accent)',
    bg: 'var(--tool-text-bg)',
    border: 'var(--tool-text-border)',
  },
  {
    icon: Sparkles,
    category: 'Combined Multi-Tool',
    tag: 'Multi-Tool Execution',
    prompt: 'Research Google ADK and calculate 18% of ₹50,000.',
    color: 'var(--text-primary)',
    bg: 'var(--bg-card)',
    border: 'var(--border-color)',
  },
]

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectPrompt }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] px-4 py-8 text-center max-w-4xl mx-auto">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none rounded-3xl" />

      {/* Brand Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/80 px-3.5 py-1 text-xs font-mono text-[var(--text-secondary)] shadow-xs backdrop-blur-xs"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>ASTER AI • Google ADK Root Agent</span>
      </motion.div>

      {/* Oversized Editorial Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 font-editorial text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] text-[var(--text-primary)] max-w-2xl"
      >
        One assistant.
        <br />
        <span className="italic font-light opacity-90">Three powerful tools.</span>
      </motion.h1>

      {/* Supporting Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="relative z-10 mt-6 max-w-lg text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
      >
        Research the web, calculate with precision, and analyze text in one seamless conversation.
      </motion.p>

      {/* Interactive Example Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 mt-10 grid w-full grid-cols-1 sm:grid-cols-2 gap-3.5 text-left"
      >
        {EXAMPLE_PROMPTS.map((item, idx) => {
          const Icon = item.icon
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/90 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--text-muted)] cursor-pointer text-left"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.category}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]" />
                </div>
                <div className="mt-3 text-sm font-medium text-[var(--text-primary)] leading-snug">
                  "{item.prompt}"
                </div>
              </div>
              <div className="mt-3 text-[11px] font-mono text-[var(--text-muted)]">
                {item.tag}
              </div>
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}
