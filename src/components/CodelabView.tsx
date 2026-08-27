import { FC, useState } from 'react';
import {
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Play,
  Copy,
  Check,
  Cpu,
  Sparkles,
  ArrowRight,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';
import { CODELAB_STEPS } from '../data/codelabSteps';
import { AgentConfig } from '../types';

interface CodelabViewProps {
  currentStepId: number;
  onSelectStep: (stepId: number) => void;
  completedSteps: number[];
  onToggleCompleteStep: (stepId: number) => void;
  agentConfig: AgentConfig;
  onUpdateAgentConfig: (updated: Partial<AgentConfig>) => void;
  onJumpToStudioWithPrompt?: (prompt: string) => void;
  onRunSandboxQuery: (query: string) => void;
}

export const CodelabView: FC<CodelabViewProps> = ({
  currentStepId,
  onSelectStep,
  completedSteps,
  onToggleCompleteStep,
  agentConfig,
  onUpdateAgentConfig,
  onRunSandboxQuery,
}) => {
  const currentStep =
    CODELAB_STEPS.find((s) => s.id === currentStepId) || CODELAB_STEPS[0];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [customTestQuery, setCustomTestQuery] = useState(
    currentStep.challenge.testQuery
  );
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const isCompleted = completedSteps.includes(currentStep.id);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApplySolution = () => {
    onUpdateAgentConfig({
      systemPrompt: currentStep.challenge.solutionPrompt,
    });
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 2500);
  };

  const handleTestInSandbox = () => {
    onRunSandboxQuery(customTestQuery || currentStep.challenge.testQuery);
  };

  const progressPercent = Math.round(
    (completedSteps.length / CODELAB_STEPS.length) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Hero Banner */}
      <div className="relative bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 overflow-hidden">
        {/* Large background decorative serif numeral */}
        <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
          <span
            className="text-[16rem] sm:text-[22rem] font-black leading-none text-white"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {String(currentStep.id).padStart(2, '0')}
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="uppercase text-blue-500 font-bold tracking-[0.4em] text-xs">
              Chapter {String(currentStep.id).padStart(2, '0')} // Codelab
            </span>
            <span className="h-px w-8 bg-blue-500/40" />
            <span className="text-[10px] uppercase font-mono text-white/40 tracking-widest">
              Duration: {currentStep.duration}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Build &amp; Deploy <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.85)' }}
            >
              AI Agents
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed mb-8 max-w-2xl">
            Learn to architect, equip with real-time tool calling, guardrail, and deploy enterprise-grade customer AI agents powered by Gemini 3.7 Flash.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onRunSandboxQuery(currentStep.challenge.testQuery)}
              className="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-white/5 flex items-center space-x-2"
            >
              <span>Test Current Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleApplySolution}
              className="border border-white/20 px-8 py-4 font-bold uppercase tracking-widest text-xs text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>{appliedFeedback ? 'Prompt Loaded!' : 'Load Step Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Progress Strip in Hero */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-[10px] uppercase font-mono tracking-widest text-white/40">
              Curriculum Progress
            </div>
            <div className="w-32 h-[2px] bg-white/10 relative">
              <div
                className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] font-mono font-bold text-blue-400">
              {progressPercent}%
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-white/50">
            <span>Completed:</span>
            <span className="text-white font-bold">
              {completedSteps.length} of {CODELAB_STEPS.length} Steps
            </span>
          </div>
        </div>
      </div>

      {/* Chapter Steps Ribbon Navigation */}
      <div className="bg-[#0a0a0a] border border-white/10 p-4 sm:p-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono font-semibold mb-4">
          The Syllabus // 06 Modules
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {CODELAB_STEPS.map((step) => {
            const isActive = step.id === currentStep.id;
            const stepDone = completedSteps.includes(step.id);
            return (
              <button
                key={step.id}
                id={`step-nav-btn-${step.id}`}
                onClick={() => {
                  onSelectStep(step.id);
                  setCustomTestQuery(step.challenge.testQuery);
                  setShowHint(false);
                }}
                className={`text-left p-3.5 transition-all relative border ${
                  isActive
                    ? 'bg-white text-black border-white font-semibold shadow-md shadow-white/5'
                    : stepDone
                    ? 'bg-white/[0.04] text-white border-white/20 hover:border-white/40'
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/25 hover:text-white/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? 'text-blue-600' : 'text-blue-400'
                    }`}
                  >
                    0{step.id}.
                  </span>
                  {stepDone && (
                    <CheckCircle
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-black' : 'text-emerald-400'
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`text-xs font-bold uppercase tracking-tight line-clamp-1 ${
                    isActive ? 'text-black' : 'text-white'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-[9px] uppercase font-mono tracking-wider mt-1 ${
                    isActive ? 'text-black/60' : 'text-white/40'
                  }`}
                >
                  {step.duration}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content & Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Step Narrative, Theory & Concepts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step Header Card */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold bg-blue-600 text-white">
                  Step {currentStep.id} of {CODELAB_STEPS.length}
                </span>
                <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/20 text-white/70">
                  {currentStep.duration}
                </span>
                <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-indigo-500/30 text-indigo-400 bg-indigo-950/20">
                  {currentStep.difficulty}
                </span>
              </div>

              <button
                id={`mark-complete-btn-${currentStep.id}`}
                onClick={() => onToggleCompleteStep(currentStep.id)}
                className={`flex items-center space-x-2 px-4 py-1.5 text-xs uppercase tracking-wider font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'border border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {currentStep.title}
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mt-1">
              // {currentStep.subtitle}
            </p>
            <p className="text-sm text-white/70 mt-4 leading-relaxed font-light">
              {currentStep.summary}
            </p>

            {/* Learning Objectives */}
            <div className="mt-6 p-5 bg-[#050505] border border-white/10">
              <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 flex items-center space-x-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Learning Objectives</span>
              </h4>
              <ul className="space-y-2.5">
                {currentStep.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-3 text-xs text-white/80">
                    <span className="text-blue-500 font-mono text-xs">→</span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conceptual Modules & Code Snippets */}
          {currentStep.concepts.map((concept, index) => (
            <div
              key={index}
              className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                  {concept.title}
                </h3>
              </div>

              <p className="text-sm text-white/70 leading-relaxed font-light">
                {concept.description}
              </p>

              {/* Architecture Blueprint representation if applicable */}
              {concept.diagramType === 'architecture' && (
                <div className="p-6 bg-[#050505] border border-white/15 text-xs">
                  <div className="font-mono text-white/40 uppercase tracking-widest text-[10px] mb-4">
                    // SYSTEM ARCHITECTURE BLUEPRINT
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-4 bg-[#0d0d0d] border border-white/10">
                      <div className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                        01. Customer Ingress
                      </div>
                      <div className="text-[11px] text-white/60 mt-1">
                        Web Chat Widget &amp; SDK
                      </div>
                    </div>
                    <div className="p-4 bg-blue-950/40 border border-blue-500/30">
                      <div className="text-[10px] font-mono uppercase text-blue-300 font-bold">
                        02. Gemini 3.7 Flash
                      </div>
                      <div className="text-[11px] text-white/60 mt-1">
                        Reasoning &amp; Tool Calling
                      </div>
                    </div>
                    <div className="p-4 bg-[#0d0d0d] border border-white/10">
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                        03. Live Tool Execution
                      </div>
                      <div className="text-[11px] text-white/60 mt-1">
                        Orders, Returns, Escalations
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {concept.diagramType === 'tools' && (
                <div className="p-5 bg-[#050505] border border-white/15 text-xs font-mono">
                  <div className="text-emerald-400 font-semibold mb-1 uppercase text-[11px] tracking-wider">
                    // FUNCTION_DECLARATION CONTRACT
                  </div>
                  <div className="text-white/80">
                    name: <span className="text-amber-300">"lookupOrder"</span> | params: {'{'} orderId: string {'}'}
                  </div>
                </div>
              )}

              {concept.codeSnippet && (
                <div className="relative group">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#050505] text-white/60 text-xs font-mono border border-white/15 border-b-0">
                    <span className="uppercase text-[10px] tracking-widest">
                      TypeScript // @google/genai SDK
                    </span>
                    <button
                      onClick={() => handleCopyCode(concept.codeSnippet!, index)}
                      className="flex items-center space-x-1.5 text-white/80 hover:text-white transition-colors"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-mono text-[11px]">Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-5 bg-[#030303] text-[#F5F5F5] font-mono text-xs overflow-x-auto border border-white/15 leading-relaxed">
                    <code>{concept.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}

          {/* Key Takeaways Card */}
          <div className="bg-[#0a0a0a] border border-blue-500/30 p-6 sm:p-8">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-blue-400 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Architectural Takeaways</span>
            </h4>
            <ul className="space-y-3">
              {currentStep.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs text-white/80">
                  <span className="text-blue-500 font-mono text-xs">■</span>
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Step Navigation Footer */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => {
                if (currentStep.id > 1) onSelectStep(currentStep.id - 1);
              }}
              disabled={currentStep.id === 1}
              className="flex items-center space-x-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white/80 bg-white/5 hover:bg-white/10 border border-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={() => {
                if (currentStep.id < CODELAB_STEPS.length) {
                  if (!isCompleted) onToggleCompleteStep(currentStep.id);
                  onSelectStep(currentStep.id + 1);
                }
              }}
              disabled={currentStep.id === CODELAB_STEPS.length}
              className="flex items-center space-x-2 px-6 py-3 text-xs uppercase tracking-wider font-bold text-black bg-white hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-white/5"
            >
              <span>Next: Chapter 0{Math.min(currentStep.id + 1, CODELAB_STEPS.length)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Interactive Checkpoint & Live Challenge Studio */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 sticky top-28 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Step 0{currentStep.id} Challenge</span>
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] font-mono text-white/50 hover:text-blue-400 uppercase tracking-wider underline"
              >
                {showHint ? 'Hide Hint' : 'Need Hint?'}
              </button>
            </div>

            <h4 className="text-base font-bold uppercase tracking-tight text-white">
              Hands-On Verification
            </h4>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              {currentStep.challenge.instructions}
            </p>

            {/* Hint box */}
            {showHint && (
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <span className="font-bold uppercase font-mono text-[10px] tracking-wider block mb-1">
                  💡 Architectural Hint:
                </span>
                {currentStep.challenge.hint}
              </div>
            )}

            {/* Expected outcome */}
            <div className="p-4 bg-[#050505] border border-white/10 text-xs space-y-1.5">
              <div className="font-mono uppercase text-[10px] tracking-widest text-white/50">
                Expected Agent Outcome:
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                {currentStep.challenge.expectedOutcome}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                01 // Load System Prompt Solution:
              </div>
              <button
                id={`apply-solution-btn-${currentStep.id}`}
                onClick={handleApplySolution}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>{appliedFeedback ? 'Applied to Active Agent!' : 'Apply Step System Prompt'}</span>
              </button>

              <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 pt-2">
                02 // Sandbox Test Query:
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customTestQuery}
                  onChange={(e) => setCustomTestQuery(e.target.value)}
                  placeholder="Enter test prompt..."
                  className="w-full text-xs px-3.5 py-2.5 bg-[#050505] border border-white/20 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  id={`run-sandbox-test-btn-${currentStep.id}`}
                  onClick={handleTestInSandbox}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute in Agent Sandbox</span>
                </button>
              </div>
            </div>

            {/* Current Active Agent Status Card */}
            <div className="p-3.5 bg-[#050505] border border-white/10 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-white/60 text-[11px]">
                <span>Active Model:</span>
                <span className="text-blue-400 font-bold">gemini-3.7-flash</span>
              </div>
              <div className="flex items-center justify-between text-white/60 text-[11px]">
                <span>Active Tools:</span>
                <span className="text-white font-bold">{agentConfig.enabledTools.length} enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
