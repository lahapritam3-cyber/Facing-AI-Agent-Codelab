import { FC, useState, useRef, useEffect, FormEvent } from 'react';
import {
  Send,
  Bot,
  User,
  Wrench,
  Sparkles,
  Shield,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
  FileText,
  Store,
  Terminal,
  Zap,
} from 'lucide-react';
import { AgentConfig, ChatMessage, ToolDefinition } from '../types';
import { CUSTOMER_PERSONAS, DEMO_STORE_PRODUCTS } from '../data/mockStoreData';

interface AgentStudioViewProps {
  agentConfig: AgentConfig;
  onUpdateAgentConfig: (updated: Partial<AgentConfig>) => void;
  availableTools: ToolDefinition[];
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onOpenDatabase: () => void;
}

export const AgentStudioView: FC<AgentStudioViewProps> = ({
  agentConfig,
  onUpdateAgentConfig,
  availableTools,
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onOpenDatabase,
}) => {
  const [studioTab, setStudioTab] = useState<'storefront' | 'debugger'>('storefront');
  const [inputText, setInputText] = useState('');
  const [isOptimizingPrompt, setIsOptimizingPrompt] = useState(false);
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    improvedPrompt: string;
    keyChanges: string[];
    proTips: string[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmitMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleSelectPersona = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleToggleTool = (toolName: string) => {
    const isEnabled = agentConfig.enabledTools.includes(toolName);
    const newTools = isEnabled
      ? agentConfig.enabledTools.filter((t) => t !== toolName)
      : [...agentConfig.enabledTools, toolName];
    onUpdateAgentConfig({ enabledTools: newTools });
  };

  const handleOptimizePrompt = async () => {
    setIsOptimizingPrompt(true);
    try {
      const res = await fetch('/api/agent/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPrompt: agentConfig.systemPrompt,
          weaknessesOrGoals:
            'Enhance Gemini tool calling accuracy, strict 30-day return policy enforcement, human escalation triggers, and prompt injection defense.',
        }),
      });
      const data = await res.json();
      setOptimizationResult(data);
      setOptimizeModalOpen(true);
    } catch (err) {
      console.error('Failed to optimize prompt', err);
    } finally {
      setIsOptimizingPrompt(false);
    }
  };

  const applyOptimizedPrompt = () => {
    if (optimizationResult?.improvedPrompt) {
      onUpdateAgentConfig({ systemPrompt: optimizationResult.improvedPrompt });
      setOptimizeModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0a0a] p-6 border border-white/10">
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-[0.25em] text-xs font-bold text-white">
                Sandbox &amp; Agent Studio
              </span>
              <span className="px-2 py-0.5 border border-blue-500/40 bg-blue-950/30 text-blue-400 font-mono text-[9px] uppercase tracking-wider">
                Multi-Turn Tool Loop
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-mono mt-0.5">
              Tune system instructions, inspect Gemini function calls, and test customer personas.
            </p>
          </div>
        </div>

        {/* View Switcher: Customer Storefront vs Developer Debugger */}
        <div className="flex items-center space-x-2.5">
          <div className="bg-[#050505] p-1 border border-white/10 flex items-center space-x-1">
            <button
              id="view-storefront-btn"
              onClick={() => setStudioTab('storefront')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition-all ${
                studioTab === 'storefront'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <button
              id="view-debugger-btn"
              onClick={() => setStudioTab('debugger')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition-all ${
                studioTab === 'debugger'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Debugger</span>
            </button>
          </div>

          <button
            onClick={onClearChat}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Configurator (5 cols), Right Simulator (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Agent Architecture & Configurator */}
        <div className="lg:col-span-5 space-y-6">
          {/* System Prompt Tuner Card */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold">
                  System Instructions
                </h3>
              </div>

              <button
                id="optimize-prompt-btn"
                onClick={handleOptimizePrompt}
                disabled={isOptimizingPrompt}
                className="flex items-center space-x-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{isOptimizingPrompt ? 'Synthesizing...' : 'AI Optimizer'}</span>
              </button>
            </div>

            <textarea
              id="system-prompt-textarea"
              rows={8}
              value={agentConfig.systemPrompt}
              onChange={(e) => onUpdateAgentConfig({ systemPrompt: e.target.value })}
              placeholder="Define agent persona, grounding rules, and tool instructions..."
              className="w-full text-xs font-mono p-3.5 bg-[#050505] border border-white/15 text-white/90 focus:outline-none focus:border-blue-500 leading-relaxed"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest pt-1">
              <span>Model: <strong className="text-blue-400">gemini-3.7-flash</strong></span>
              <span>{agentConfig.systemPrompt.length} Characters</span>
            </div>
          </div>

          {/* Tools & Capabilities Configuration */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold">
                  Function Declarations ({agentConfig.enabledTools.length}/{availableTools.length})
                </h3>
              </div>
            </div>

            <p className="text-xs text-white/60 font-light">
              Toggle backend tool schemas accessible to Gemini during customer query resolution.
            </p>

            <div className="space-y-2.5">
              {availableTools.map((tool) => {
                const isEnabled = agentConfig.enabledTools.includes(tool.name);
                return (
                  <div
                    key={tool.name}
                    className={`p-3 border text-xs transition-all ${
                      isEnabled
                        ? 'bg-[#050505] border-blue-500/40 text-white'
                        : 'bg-[#050505]/40 border-white/10 text-white/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2.5 cursor-pointer font-mono font-bold text-xs">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleToggleTool(tool.name)}
                          className="rounded-none bg-black border-white/30 text-blue-600 focus:ring-0 h-3.5 w-3.5"
                        />
                        <span className={isEnabled ? 'text-blue-300' : 'text-white/40'}>
                          {tool.name}()
                        </span>
                      </label>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-1.5 pl-6 leading-relaxed font-light">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guardrails & Safety Policy Switches */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold">
                Safety &amp; Compliance Guardrails
              </h3>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 bg-[#050505] border border-white/10 text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-white font-mono text-[11px] uppercase">
                    PII Redaction Engine
                  </div>
                  <div className="text-[11px] text-white/50 font-light mt-0.5">
                    Auto-sanitize credit card &amp; personal identification strings
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={agentConfig.guardrails.enforcePIISanitization}
                  onChange={(e) =>
                    onUpdateAgentConfig({
                      guardrails: {
                        ...agentConfig.guardrails,
                        enforcePIISanitization: e.target.checked,
                      },
                    })
                  }
                  className="rounded-none bg-black border-white/30 text-blue-600 focus:ring-0 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#050505] border border-white/10 text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-white font-mono text-[11px] uppercase">
                    Policy Strict Grounding
                  </div>
                  <div className="text-[11px] text-white/50 font-light mt-0.5">
                    Enforce 30-day return validation &amp; escalation protocol
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={agentConfig.guardrails.enforcePolicyGrounding}
                  onChange={(e) =>
                    onUpdateAgentConfig({
                      guardrails: {
                        ...agentConfig.guardrails,
                        enforcePolicyGrounding: e.target.checked,
                      },
                    })
                  }
                  className="rounded-none bg-black border-white/30 text-blue-600 focus:ring-0 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Customer Personas Quick Sandbox Scenarios */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold">
                Customer Persona Scenarios
              </h3>
              <span className="text-[10px] font-mono text-white/40 uppercase">Click to test</span>
            </div>

            <div className="space-y-2.5">
              {CUSTOMER_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  id={`persona-btn-${persona.id}`}
                  onClick={() => handleSelectPersona(persona.testPrompt)}
                  className="w-full text-left p-3 border border-white/10 hover:border-blue-500/50 bg-[#050505] hover:bg-blue-950/20 transition-all text-xs flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/20"
                    />
                    <div className="truncate">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase text-[11px] tracking-wide">
                        {persona.name}
                      </div>
                      <div className="text-[10px] text-white/50 truncate font-mono mt-0.5">
                        {persona.scenario}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-white/5 border border-white/15 text-white/70 shrink-0">
                    {persona.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Storefront or Developer Debugger */}
        <div className="lg:col-span-7">
          {studioTab === 'storefront' ? (
            /* STOREFRONT VIEW */
            <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col h-[850px]">
              {/* Mock E-Commerce Nav */}
              <div className="bg-[#050505] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                    L
                  </div>
                  <span className="font-black text-sm tracking-wider uppercase font-mono">
                    LUMINA GOODS &amp; GEAR
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-white/5 text-white/60 px-2 py-0.5 border border-white/10">
                    Storefront Simulator
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono uppercase text-white/60">
                  <button
                    onClick={onOpenDatabase}
                    className="hover:text-white transition-colors"
                  >
                    Account
                  </button>
                  <div className="flex items-center space-x-1.5 bg-white/5 px-2.5 py-1 border border-white/10 text-white">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px]">Cart (1)</span>
                  </div>
                </div>
              </div>

              {/* Storefront Hero */}
              <div className="bg-[#080808] border-b border-white/10 p-6 relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-blue-400 block mb-1">
                    Editorial Collection // 2026
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                    Engineered Acoustics &amp; Ergonomics
                  </h3>
                  <p className="text-xs text-white/60 mt-1 font-light">
                    Complimentary express dispatch on flagship products. 30-day verified return policy.
                  </p>
                </div>
              </div>

              {/* Storefront Catalog Grid */}
              <div className="p-4 bg-[#050505] border-b border-white/10">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                    Active Catalog Items (Synced to Agent Database)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DEMO_STORE_PRODUCTS.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#0a0a0a] p-3 border border-white/10 hover:border-white/20 transition-all text-xs"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-20 object-cover grayscale contrast-125 mb-2.5 border border-white/5"
                      />
                      <div className="text-[11px] font-bold text-white truncate uppercase tracking-tight">
                        {prod.name}
                      </div>
                      <div className="flex items-center justify-between mt-1.5 font-mono text-[10px]">
                        <span className="text-blue-400 font-bold">${prod.price}</span>
                        <span className={prod.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {prod.stock > 0 ? `${prod.stock} in stock` : 'Out'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Support Drawer inside Storefront */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#070707]">
                {/* Chat Top Banner */}
                <div className="px-5 py-3 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        {agentConfig.personaName}
                      </div>
                      <div className="text-[10px] font-mono text-white/40">
                        {agentConfig.enabledTools.length} Live Gemini Tools Connected
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono uppercase tracking-wider text-blue-400 bg-blue-950/40 px-2.5 py-1 border border-blue-500/30">
                    Live Session
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {/* Greeting */}
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-[#121212] p-4 text-xs text-white/90 leading-relaxed border border-white/10 font-light">
                      {agentConfig.greetingMessage}
                    </div>
                  </div>

                  {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex items-start space-x-3 ${
                          isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className="max-w-[85%] space-y-2">
                          {/* Tool execution badge */}
                          {msg.toolCalls && msg.toolCalls.length > 0 && (
                            <div className="space-y-1.5">
                              {msg.toolCalls.map((tc, tcIdx) => (
                                <div
                                  key={tcIdx}
                                  className="flex items-center space-x-2 px-3 py-1.5 bg-[#050505] border border-blue-500/40 text-[10px] text-blue-300 font-mono"
                                >
                                  <Zap className="w-3 h-3 text-blue-400" />
                                  <span>Invoked tool:</span>
                                  <strong className="text-white">{tc.name}()</strong>
                                  <span className="text-white/40">({tc.durationMs}ms)</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div
                            className={`p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                              isUser
                                ? 'bg-blue-600 text-white font-medium'
                                : 'bg-[#121212] text-white/90 border border-white/10 font-light'
                            }`}
                          >
                            {msg.content}
                          </div>

                          <div
                            className={`text-[9px] font-mono text-white/40 uppercase ${
                              isUser ? 'text-right' : 'text-left'
                            }`}
                          >
                            {msg.timestamp || 'Just now'}
                          </div>
                        </div>

                        {isUser && (
                          <div className="w-7 h-7 bg-white text-black flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-[#121212] p-3.5 text-xs text-white/60 border border-white/10 flex items-center space-x-2 font-mono">
                        <div className="w-1.5 h-1.5 bg-blue-500 animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-blue-500 animate-pulse delay-75" />
                        <div className="w-1.5 h-1.5 bg-blue-500 animate-pulse delay-150" />
                        <span className="text-[11px]">Gemini 3.7 reasoning &amp; evaluating tools...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSubmitMessage}
                  className="p-3 bg-[#0a0a0a] border-t border-white/10 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    id="chat-input-field"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about orders (e.g. ORD-8821), returns, shipping, or stock..."
                    className="flex-1 text-xs px-4 py-3 bg-[#050505] border border-white/15 text-white focus:outline-none focus:border-blue-500 font-mono"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    id="send-chat-btn"
                    disabled={!inputText.trim() || isLoading}
                    className="p-3 bg-white hover:bg-blue-600 text-black hover:text-white disabled:opacity-30 transition-all font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* DEVELOPER DEBUGGER VIEW */
            <div className="bg-[#050505] border border-white/15 text-[#F5F5F5] overflow-hidden flex flex-col h-[850px]">
              {/* Debugger Header */}
              <div className="bg-[#0a0a0a] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                    GEMINI FUNCTION CALLING INSPECTOR
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-mono">
                  <span className="text-emerald-400">STATUS: READY</span>
                  <span className="text-white/20">|</span>
                  <span className="text-blue-400">MODEL: gemini-3.7-flash</span>
                </div>
              </div>

              {/* Debugger Message Stream with Expandable Function Payloads */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-xs">
                <div className="p-4 bg-[#0a0a0a] border border-white/10 text-white/50 text-[11px]">
                  <span className="text-blue-400 font-bold">[ACTIVE SYSTEM INSTRUCTION]: </span>
                  {agentConfig.systemPrompt.slice(0, 180)}...
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-20 text-white/30 font-mono text-xs uppercase tracking-widest">
                    Send a query to observe raw multi-turn tool calling traces and JSON payloads.
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span
                        className={`px-2 py-0.5 font-bold uppercase ${
                          msg.role === 'user'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        {msg.role}
                      </span>
                      <span className="text-white/40">{msg.timestamp}</span>
                    </div>

                    <div className="p-4 bg-[#0a0a0a] border border-white/10 text-white/90 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Tool Calls Logs Breakdown */}
                    {msg.toolCalls && msg.toolCalls.map((tc, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-4 bg-blue-950/20 border border-blue-500/30 space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-blue-300 font-bold">
                          <div className="flex items-center space-x-1.5">
                            <Zap className="w-3.5 h-3.5 text-blue-400" />
                            <span>FUNCTION CALL: {tc.name}()</span>
                          </div>
                          <span className="text-[10px] text-white/40">{tc.durationMs}ms</span>
                        </div>

                        <div>
                          <div className="text-[10px] text-white/40 mb-1">// Gemini Input Arguments:</div>
                          <pre className="p-2.5 bg-[#030303] text-white/80 overflow-x-auto text-[11px] border border-white/10">
                            {JSON.stringify(tc.args, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <div className="text-[10px] text-white/40 mb-1">// Tool Return Payload:</div>
                          <pre className="p-2.5 bg-[#030303] text-emerald-400 overflow-x-auto text-[11px] border border-white/10">
                            {JSON.stringify(tc.result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {isLoading && (
                  <div className="p-4 bg-[#0a0a0a] border border-blue-500/40 text-blue-400 flex items-center space-x-2 animate-pulse">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Executing Gemini 3.7 Flash tool reasoning loop...</span>
                  </div>
                )}
              </div>

              {/* Debugger Input Bar */}
              <form
                onSubmit={handleSubmitMessage}
                className="p-3.5 bg-[#0a0a0a] border-t border-white/10 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Execute custom prompt in debug mode..."
                  className="flex-1 text-xs px-3.5 py-2.5 bg-[#050505] border border-white/20 text-white focus:outline-none focus:border-blue-500 font-mono"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-40 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* AI Prompt Optimizer Modal */}
      {optimizeModalOpen && optimizationResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] max-w-2xl w-full p-8 border border-white/20 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                  AI-Optimized System Prompt
                </h3>
              </div>
              <button
                onClick={() => setOptimizeModalOpen(false)}
                className="text-white/50 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 font-light leading-relaxed">
              Gemini analyzed your agent configuration and synthesized an optimized prompt for enterprise customer support accuracy.
            </p>

            {/* Key changes */}
            <div className="p-4 bg-[#050505] border border-blue-500/30 text-xs">
              <div className="font-mono text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-2">
                Key Optimizations:
              </div>
              <ul className="space-y-1.5">
                {optimizationResult.keyChanges.map((change, i) => (
                  <li key={i} className="flex items-start space-x-2 text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
                Synthesized Prompt:
              </div>
              <pre className="p-4 bg-[#030303] text-white/90 border border-white/15 text-xs font-mono overflow-x-auto leading-relaxed max-h-60">
                {optimizationResult.improvedPrompt}
              </pre>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setOptimizeModalOpen(false)}
                className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={applyOptimizedPrompt}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-blue-600 hover:text-white transition-all shadow-md shadow-white/5"
              >
                Apply to Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
