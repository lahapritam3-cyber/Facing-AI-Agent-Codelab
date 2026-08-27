export type TabMode = 'codelab' | 'studio' | 'eval' | 'deploy';

export interface CodelabStep {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objectives: string[];
  concepts: {
    title: string;
    description: string;
    codeSnippet?: string;
    diagramType?: 'architecture' | 'flow' | 'tools' | 'guardrails' | 'eval';
  }[];
  challenge: {
    instructions: string;
    hint: string;
    starterPrompt: string;
    solutionPrompt: string;
    testQuery: string;
    expectedOutcome: string;
  };
  keyTakeaways: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolExecutionLog[];
  guardrailStatus?: {
    piiFiltered?: boolean;
    sentimentDetected?: string;
    policyGrounded?: boolean;
  };
  latencyMs?: number;
}

export interface ToolExecutionLog {
  name: string;
  args: Record<string, any>;
  result: any;
  durationMs: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  category: 'Orders' | 'Catalog' | 'Support' | 'Loyalty';
}

export interface AgentConfig {
  systemPrompt: string;
  temperature: number;
  enabledTools: string[];
  guardrails: {
    enforcePIISanitization: boolean;
    enforcePolicyGrounding: boolean;
    sentimentEscalation: boolean;
    hallucinationMitigation: boolean;
  };
  personaName: string;
  greetingMessage: string;
}

export interface EvalTestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  userPrompt: string;
  expectedTools: string[];
  expectedBehavior: string;
}

export interface EvalResult {
  testId: string;
  testName: string;
  category: string;
  prompt: string;
  expectedBehavior: string;
  agentResponse?: string;
  toolCallsMade?: string[];
  toolResults?: any[];
  passed: boolean;
  overallScore: number;
  toolUsageScore?: number;
  policyAccuracyScore?: number;
  toneAndEmpathyScore?: number;
  safetyScore?: number;
  feedback?: string;
  recommendations?: string;
  latencyMs?: number;
  error?: string;
}

export interface EvalSuiteReport {
  totalTests: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  averageScore: number;
  results: EvalResult[];
}

export interface CustomerPersona {
  id: string;
  name: string;
  avatar: string;
  title: string;
  email: string;
  scenario: string;
  testPrompt: string;
  badge: string;
  badgeColor: string;
}
