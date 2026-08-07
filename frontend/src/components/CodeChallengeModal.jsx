import React, { useState } from 'react'
import { X, Code, Play, Check, Copy } from 'lucide-react'

export default function CodeChallengeModal({ isOpen, onClose, onSubmitCode }) {
  const [code, setCode] = useState(`// Model Context Protocol (MCP) Server Schema Definition
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

const server = new Server({
  name: "neuron-ai-context-engine",
  version: "2.4.0",
}, {
  capabilities: {
    tools: {},
    prompts: {},
  }
});

// Define secure context window trimming tool
server.setRequestHandler("call_tool", async (request) => {
  if (request.params.name === "summarize_context") {
    return {
      content: [{ type: "text", text: "Context compressed by 42% via sliding window vector store." }]
    };
  }
});
`)

  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    onSubmitCode(code)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Code & Tool Schema Playground</h3>
              <p className="text-[11px] text-slate-400">Attach formatted TypeScript / Python snippets to your interview response</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Editor Body */}
        <div className="p-4 bg-slate-950/90 font-mono text-xs flex-1 overflow-auto">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
            <span>TypeScript (MCP Architecture)</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full bg-transparent text-indigo-200 focus:outline-none resize-none font-mono text-xs leading-relaxed"
            placeholder="// Paste or write your code solution here..."
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-indigo-500/20">
          <span className="text-[11px] text-slate-400">Auto-formatted with syntax validation</span>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Attach Code to Chat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
