import { FC, useState } from 'react';
import {
  Rocket,
  Code2,
  Copy,
  Check,
  Server,
  Cloud,
  Layers,
  Sliders,
  Download,
} from 'lucide-react';
import { AgentConfig, ToolDefinition } from '../types';

interface DeploymentHubViewProps {
  agentConfig: AgentConfig;
  availableTools: ToolDefinition[];
}

export const DeploymentHubView: FC<DeploymentHubViewProps> = ({
  agentConfig,
  availableTools,
}) => {
  const [deployTab, setDeployTab] = useState<'embed' | 'react' | 'express' | 'cloudrun'>('embed');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Widget customizer state
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [widgetPosition, setWidgetPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [widgetTitle, setWidgetTitle] = useState('Lumina AI Assistant');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportAgentConfig = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            version: '2.0.4',
            exportedAt: new Date().toISOString(),
            model: 'gemini-3.7-flash',
            agentConfig,
            tools: availableTools.filter((t) => agentConfig.enabledTools.includes(t.name)),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `customer-ai-agent-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Embed script snippet
  const embedSnippet = `<!-- Lumina Customer AI Chat Widget -->
<script
  src="https://cdn.lumina-ai.com/v1/widget.js"
  data-agent-id="lumina-agent-prod"
  data-theme-color="${themeColor}"
  data-position="${widgetPosition}"
  data-title="${widgetTitle}"
  data-greeting="${agentConfig.greetingMessage}"
  async
></script>`;

  // React Hook Snippet
  const reactSnippet = `import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: any[];
}

export function useCustomerSupportAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userText: string) => {
    const userMsg: ChatMessage = { role: 'user', content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          systemInstruction: \`${agentConfig.systemPrompt.replace(/`/g, '\\`')}\`,
          enabledToolNames: ${JSON.stringify(agentConfig.enabledTools)},
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, toolCalls: data.toolCalls },
      ]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, sendMessage, isLoading };
}`;

  // Express server route snippet
  const expressSnippet = `import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Initialize Gemini with server-side API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } }
});

app.post("/api/agent/chat", async (req, res) => {
  const { messages, systemInstruction, tools } = req.body;

  // Multi-turn tool execution loop with Gemini 3.7 Flash
  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction,
      temperature: 0.2,
      tools: [{ functionDeclarations: tools }]
    }
  });

  res.json({ reply: response.text });
});

app.listen(3000, "0.0.0.0", () => console.log("Agent backend running on port 3000"));`;

  // Cloud Run Dockerfile snippet
  const cloudRunSnippet = `# Multi-stage Dockerfile for Google Cloud Run
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Port 3000 is required by Cloud Run container ingress
EXPOSE 3000
CMD ["node", "dist/server.cjs"]

# Deploy Command:
# gcloud run deploy customer-ai-agent \\
#   --source . \\
#   --region us-central1 \\
#   --set-env-vars GEMINI_API_KEY=YOUR_KEY \\
#   --allow-unauthenticated`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Card */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="uppercase text-purple-400 font-bold tracking-[0.4em] text-xs font-mono">
                Production Ready // Integration Hub
              </span>
              <span className="h-px w-8 bg-purple-400/40" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Deployment &amp; Integration Hub
            </h1>
            <p className="text-sm text-white/70 mt-2 max-w-3xl font-light leading-relaxed">
              Export your validated customer agent configuration to embeddable web widgets, custom React hooks, Node.js microservices, or Google Cloud Run containers.
            </p>
          </div>

          <button
            id="export-agent-config-btn"
            onClick={handleExportAgentConfig}
            className="flex items-center space-x-2 px-6 py-3.5 bg-white text-black hover:bg-blue-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-white/5 shrink-0"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>Export Agent JSON Bundle</span>
          </button>
        </div>

        {/* Tab navigation for formats */}
        <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-white/10">
          <button
            id="deploy-tab-embed"
            onClick={() => setDeployTab('embed')}
            className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
              deployTab === 'embed'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Embeddable Web Widget</span>
          </button>

          <button
            id="deploy-tab-react"
            onClick={() => setDeployTab('react')}
            className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
              deployTab === 'react'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>React Hook &amp; State</span>
          </button>

          <button
            id="deploy-tab-express"
            onClick={() => setDeployTab('express')}
            className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
              deployTab === 'express'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Node / Express Route</span>
          </button>

          <button
            id="deploy-tab-cloudrun"
            onClick={() => setDeployTab('cloudrun')}
            className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
              deployTab === 'cloudrun'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Run Container</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {deployTab === 'embed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customizer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-5">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-white flex items-center space-x-2 pb-3 border-b border-white/10">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Widget Customizer</span>
              </h3>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-10 h-10 border border-white/20 cursor-pointer bg-black"
                  />
                  <span className="font-mono text-xs text-white uppercase font-bold">
                    {themeColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-2">
                  Widget Display Title
                </label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#050505] border border-white/20 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-2">
                  Viewport Position
                </label>
                <select
                  value={widgetPosition}
                  onChange={(e) => setWidgetPosition(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#050505] border border-white/20 text-white font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              {/* Live Preview Mini Box */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-3">
                  Live Floating Bubble Preview
                </div>
                <div className="p-8 bg-[#050505] border border-white/10 flex items-center justify-center relative min-h-[120px]">
                  <div
                    style={{ backgroundColor: themeColor }}
                    className="px-5 py-3 rounded-full text-white shadow-xl cursor-pointer flex items-center space-x-2.5 animate-pulse"
                  >
                    <Rocket className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{widgetTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embed Code Snippet */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="text-xs font-mono uppercase tracking-widest text-white/60">
                  HTML Embed Snippet
                </div>
                <button
                  onClick={() => handleCopy(embedSnippet, 'embed')}
                  className="flex items-center space-x-2 text-xs font-mono uppercase text-blue-400 hover:text-white transition-colors"
                >
                  {copiedKey === 'embed' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Embed Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-5 bg-[#030303] text-white font-mono text-xs overflow-x-auto leading-relaxed border border-white/15">
                <code>{embedSnippet}</code>
              </pre>

              <div className="p-4 bg-[#050505] border border-white/10 text-xs text-white/70 leading-relaxed font-light">
                Insert this script tag right before the closing <code className="font-mono text-blue-400">&lt;/body&gt;</code> tag on any e-commerce storefront (Shopify, WordPress, Webflow, Next.js, or HTML static site).
              </div>
            </div>
          </div>
        </div>
      )}

      {deployTab === 'react' && (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                React Hook Integration (TypeScript)
              </h3>
              <p className="text-xs text-white/60 font-light mt-0.5">
                Reusable hook for managing multi-turn agent conversations, tools, and loading states.
              </p>
            </div>
            <button
              onClick={() => handleCopy(reactSnippet, 'react')}
              className="flex items-center space-x-2 text-xs font-mono uppercase text-blue-400 hover:text-white transition-colors"
            >
              {copiedKey === 'react' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy React Hook</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 bg-[#030303] text-white font-mono text-xs overflow-x-auto leading-relaxed border border-white/15 max-h-[500px]">
            <code>{reactSnippet}</code>
          </pre>
        </div>
      )}

      {deployTab === 'express' && (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                Node / Express Backend Microservice
              </h3>
              <p className="text-xs text-white/60 font-light mt-0.5">
                Server-side proxy route using <code className="font-mono text-blue-400">@google/genai</code> to keep your Gemini API Key secure.
              </p>
            </div>
            <button
              onClick={() => handleCopy(expressSnippet, 'express')}
              className="flex items-center space-x-2 text-xs font-mono uppercase text-blue-400 hover:text-white transition-colors"
            >
              {copiedKey === 'express' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Server Route</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 bg-[#030303] text-white font-mono text-xs overflow-x-auto leading-relaxed border border-white/15 max-h-[500px]">
            <code>{expressSnippet}</code>
          </pre>
        </div>
      )}

      {deployTab === 'cloudrun' && (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                Google Cloud Run Containerfile &amp; Deploy
              </h3>
              <p className="text-xs text-white/60 font-light mt-0.5">
                Multi-stage Node.js container with single-line deploy command.
              </p>
            </div>
            <button
              onClick={() => handleCopy(cloudRunSnippet, 'cloudrun')}
              className="flex items-center space-x-2 text-xs font-mono uppercase text-blue-400 hover:text-white transition-colors"
            >
              {copiedKey === 'cloudrun' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Dockerfile</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 bg-[#030303] text-white font-mono text-xs overflow-x-auto leading-relaxed border border-white/15 max-h-[500px]">
            <code>{cloudRunSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
