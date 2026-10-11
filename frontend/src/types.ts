export interface ToolSource {
  title: string
  url: string
}

export interface ToolCall {
  tool: 'google_search' | 'calculator_tool' | 'text_analyzer_tool' | string
  input: Record<string, any>
  output?: Record<string, any>
  status: 'running' | 'completed' | 'error'
  sources?: ToolSource[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}
