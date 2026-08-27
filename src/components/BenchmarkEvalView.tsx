import { FC, useState } from 'react';
import {
  Gauge,
  Play,
  CheckCircle2,
  XCircle,
  Shield,
  Zap,
  TrendingUp,
  RefreshCw,
  Award,
  Info,
} from 'lucide-react';
import { AgentConfig, EvalSuiteReport, EvalTestCase } from '../types';

interface BenchmarkEvalViewProps {
  agentConfig: AgentConfig;
  evalTests: EvalTestCase[];
  lastReport: EvalSuiteReport | null;
  isRunningEval: boolean;
  onRunEval: () => void;
}

export const BenchmarkEvalView: FC<BenchmarkEvalViewProps> = ({
  agentConfig,
  evalTests,
  lastReport,
  isRunningEval,
  onRunEval,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const activeResult =
    lastReport?.results.find((r) => r.testId === selectedTestId) ||
    lastReport?.results[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="uppercase text-amber-400 font-bold tracking-[0.4em] text-xs font-mono">
                Continuous Benchmarking // Eval
              </span>
              <span className="h-px w-8 bg-amber-400/40" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Agent Evaluation &amp; LLM Judge Lab
            </h1>
            <p className="text-sm text-white/70 mt-2 max-w-3xl font-light leading-relaxed">
              Execute standardized test suites evaluating tool calling accuracy, strict policy grounding, sentiment de-escalation, and injection resistance.
            </p>
          </div>

          <button
            id="run-eval-suite-btn"
            onClick={onRunEval}
            disabled={isRunningEval}
            className="flex items-center space-x-2 px-8 py-4 bg-white hover:bg-blue-600 text-black hover:text-white font-bold uppercase tracking-widest text-xs transition-all shadow-md shadow-white/5 disabled:opacity-30 shrink-0"
          >
            {isRunningEval ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Running Evaluation...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Benchmark Suite (5 Tests)</span>
              </>
            )}
          </button>
        </div>

        {/* Scorecard Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="bg-[#050505] p-5 border border-white/10">
            <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono tracking-widest">
              <span>Pass Rate</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2 font-mono">
              {lastReport ? `${lastReport.passRate}%` : '--'}
            </div>
            <div className="text-[10px] font-mono text-white/40 mt-1 uppercase">
              {lastReport
                ? `${lastReport.passedCount} / ${lastReport.totalTests} tests passing`
                : 'Awaiting execution'}
            </div>
          </div>

          <div className="bg-[#050505] p-5 border border-white/10">
            <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono tracking-widest">
              <span>Average Score</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2 font-mono">
              {lastReport ? `${lastReport.averageScore}/100` : '--'}
            </div>
            <div className="text-[10px] font-mono text-white/40 mt-1 uppercase">
              Across 4 grading dimensions
            </div>
          </div>

          <div className="bg-[#050505] p-5 border border-white/10">
            <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono tracking-widest">
              <span>Judge Model</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2 uppercase font-mono">
              Gemini 3.7
            </div>
            <div className="text-[10px] font-mono text-purple-400 mt-1 uppercase">
              Automated Rubric Grading
            </div>
          </div>

          <div className="bg-[#050505] p-5 border border-white/10">
            <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono tracking-widest">
              <span>Active Tools Tested</span>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2 font-mono">
              {agentConfig.enabledTools.length}
            </div>
            <div className="text-[10px] font-mono text-white/40 mt-1 uppercase">
              Tool schemas connected
            </div>
          </div>
        </div>
      </div>

      {/* Main Results View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 cols: Test Suites List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/60 font-bold px-1">
            Test Matrix Cases ({evalTests.length})
          </h3>

          <div className="space-y-3">
            {evalTests.map((test) => {
              const res = lastReport?.results.find((r) => r.testId === test.id);
              const isSelected =
                activeResult?.testId === test.id ||
                (!activeResult && test.id === evalTests[0].id);

              return (
                <button
                  key={test.id}
                  id={`eval-test-card-${test.id}`}
                  onClick={() => setSelectedTestId(test.id)}
                  className={`w-full text-left p-5 border transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-lg shadow-white/5'
                      : 'bg-[#0a0a0a] border-white/10 hover:border-white/25 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[9px] uppercase font-mono px-2 py-0.5 border ${
                        isSelected
                          ? 'bg-black/10 text-black border-black/20'
                          : 'bg-white/5 text-white/60 border-white/10'
                      }`}
                    >
                      {test.category}
                    </span>

                    {res ? (
                      res.passed ? (
                        <span
                          className={`flex items-center space-x-1 text-[10px] font-mono font-bold px-2.5 py-0.5 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PASS ({res.overallScore}%)</span>
                        </span>
                      ) : (
                        <span
                          className={`flex items-center space-x-1 text-[10px] font-mono font-bold px-2.5 py-0.5 border ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-700'
                              : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>FAIL ({res.overallScore}%)</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-mono text-white/30 uppercase">
                        Pending
                      </span>
                    )}
                  </div>

                  <div
                    className={`font-bold text-xs uppercase tracking-tight ${
                      isSelected ? 'text-black' : 'text-white'
                    }`}
                  >
                    {test.name}
                  </div>
                  <p
                    className={`text-[11px] font-mono mt-1.5 line-clamp-2 ${
                      isSelected ? 'text-black/70' : 'text-white/50'
                    }`}
                  >
                    "{test.userPrompt}"
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 cols: Test Inspection Card & Rubric Scorecard */}
        <div className="lg:col-span-7">
          {activeResult ? (
            <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400">
                    {activeResult.category}
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
                    {activeResult.testName}
                  </h3>
                </div>

                <div className="text-right">
                  <div
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 font-mono text-xs font-bold border ${
                      activeResult.passed
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {activeResult.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>
                      {activeResult.passed ? 'PASSED' : 'FAILED'} ({activeResult.overallScore}/100)
                    </span>
                  </div>
                  {activeResult.latencyMs && (
                    <div className="text-[10px] font-mono text-white/40 mt-1">
                      LATENCY: {activeResult.latencyMs}ms
                    </div>
                  )}
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-[#050505] border border-white/10 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    Tool Accuracy
                  </div>
                  <div className="text-xl font-black text-blue-400 mt-1 font-mono">
                    {activeResult.toolUsageScore ?? 9}/10
                  </div>
                </div>

                <div className="p-4 bg-[#050505] border border-white/10 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    Policy Grounding
                  </div>
                  <div className="text-xl font-black text-indigo-400 mt-1 font-mono">
                    {activeResult.policyAccuracyScore ?? 9}/10
                  </div>
                </div>

                <div className="p-4 bg-[#050505] border border-white/10 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    Tone &amp; Empathy
                  </div>
                  <div className="text-xl font-black text-purple-400 mt-1 font-mono">
                    {activeResult.toneAndEmpathyScore ?? 9}/10
                  </div>
                </div>

                <div className="p-4 bg-[#050505] border border-white/10 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    Safety Defense
                  </div>
                  <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
                    {activeResult.safetyScore ?? 10}/10
                  </div>
                </div>
              </div>

              {/* Test Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    User Query Input:
                  </div>
                  <div className="p-3 bg-[#050505] border border-white/10 text-white font-mono text-xs">
                    "{activeResult.prompt}"
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    Agent Output:
                  </div>
                  <div className="p-4 bg-[#050505] border border-white/15 text-white/90 whitespace-pre-wrap leading-relaxed font-light">
                    {activeResult.agentResponse || 'No response generated.'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    Tools Invoked:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeResult.toolCallsMade && activeResult.toolCallsMade.length > 0 ? (
                      activeResult.toolCallsMade.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-blue-950/40 text-blue-300 border border-blue-500/30 font-mono text-[11px]"
                        >
                          {t}()
                        </span>
                      ))
                    ) : (
                      <span className="text-white/40 italic font-mono text-[11px]">
                        No tools invoked (direct conversational response)
                      </span>
                    )}
                  </div>
                </div>

                {/* Judge Feedback */}
                {activeResult.feedback && (
                  <div className="p-5 bg-blue-950/20 border border-blue-500/30 space-y-2">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-blue-300 font-bold flex items-center space-x-2">
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>LLM Judge Assessment</span>
                    </div>
                    <p className="text-white/80 leading-relaxed text-xs font-light">
                      {activeResult.feedback}
                    </p>
                    {activeResult.recommendations && (
                      <p className="text-blue-300 text-[11px] font-mono pt-1">
                        → Recommendation: {activeResult.recommendations}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-white/10 p-16 text-center">
              <Gauge className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-white">
                Benchmark Suite Idle
              </h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mt-1 font-light">
                Click "Run Benchmark Suite" to initiate multi-turn LLM judge evaluations across all test scenarios.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
