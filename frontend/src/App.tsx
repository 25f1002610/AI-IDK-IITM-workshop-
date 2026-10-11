import { useState, useEffect, useRef } from 'react'
import type { Conversation, Message } from './types'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { WelcomeView } from './components/WelcomeView'
import { ChatMessage } from './components/ChatMessage'
import { MessageComposer } from './components/MessageComposer'
import { Loader2 } from 'lucide-react'

const API_BASE_URL = 'http://127.0.0.1:8001'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('aster_theme') as 'dark' | 'light') || 'light'
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('aster_conversations')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [currentId, setCurrentId] = useState<string>(() => {
    return localStorage.getItem('aster_current_session') || ''
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [backendConnected, setBackendConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('aster_theme', theme)
  }, [theme])

  // Sync conversations to localStorage
  useEffect(() => {
    localStorage.setItem('aster_conversations', JSON.stringify(conversations))
  }, [conversations])

  // Check backend health on mount and periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`)
        if (res.ok) {
          setBackendConnected(true)
        } else {
          setBackendConnected(false)
        }
      } catch {
        setBackendConnected(false)
      }
    }
    checkHealth()
    const timer = setInterval(checkHealth, 8000)
    return () => clearInterval(timer)
  }, [])

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Get active conversation
  const currentConversation = conversations.find((c) => c.id === currentId)
  const currentMessages = currentConversation ? currentConversation.messages : []

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages, isLoading])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleNewChat = () => {
    const newId = `session_${Date.now()}`
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      messages: [],
      updatedAt: Date.now(),
    }
    setConversations((prev) => [newConv, ...prev])
    setCurrentId(newId)
    localStorage.setItem('aster_current_session', newId)
  }

  const handleSelectConversation = (id: string) => {
    setCurrentId(id)
    localStorage.setItem('aster_current_session', id)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (currentId === id) {
      setCurrentId('')
      localStorage.removeItem('aster_current_session')
    }
  }

  const handleClearCurrentChat = () => {
    if (!currentId) return
    setConversations((prev) =>
      prev.map((c) => (c.id === currentId ? { ...c, messages: [] } : c))
    )
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    let activeSessionId = currentId
    // If no active session, create one
    if (!activeSessionId) {
      activeSessionId = `session_${Date.now()}`
      const newConv: Conversation = {
        id: activeSessionId,
        title: text.length > 28 ? `${text.slice(0, 28)}...` : text,
        messages: [],
        updatedAt: Date.now(),
      }
      setConversations([newConv, ...conversations])
      setCurrentId(activeSessionId)
      localStorage.setItem('aster_current_session', activeSessionId)
    }

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    // Append user message immediately
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeSessionId) {
          const updatedTitle =
            c.messages.length === 0
              ? text.length > 28
                ? `${text.slice(0, 28)}...`
                : text
              : c.title
          return {
            ...c,
            title: updatedTitle,
            messages: [...c.messages, userMsg],
            updatedAt: Date.now(),
          }
        }
        return c
      })
    )

    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          session_id: activeSessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      const data = await response.json()

      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: data.response,
        toolCalls: data.tool_calls || [],
        timestamp: Date.now(),
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeSessionId) {
            return {
              ...c,
              messages: [...c.messages, assistantMsg],
              updatedAt: Date.now(),
            }
          }
          return c
        })
      )
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: `**Connection Notice**: Unable to communicate with the Aster AI backend at ${API_BASE_URL}.\n\n*Error details*: ${err.message || err}\n\n*Please ensure the backend server is running with 'python -m uvicorn api_server:app --port 8001'.*`,
        timestamp: Date.now(),
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeSessionId) {
            return {
              ...c,
              messages: [...c.messages, errorMsg],
              updatedAt: Date.now(),
            }
          }
          return c
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sidebar Navigation */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        conversations={conversations}
        currentId={currentId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Conversation Container */}
      <main className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          toggleTheme={toggleTheme}
          onClearChat={handleClearCurrentChat}
          backendConnected={backendConnected}
        />

        {/* Scrollable Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl py-6">
            {currentMessages.length === 0 ? (
              <WelcomeView onSelectPrompt={handleSendMessage} />
            ) : (
              <div className="space-y-2">
                {currentMessages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 py-4 text-xs text-[var(--text-muted)] font-mono">
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--text-secondary)]" />
                    <span>Aster AI is processing with Google ADK tools...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Message Input Composer */}
        <MessageComposer
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}
