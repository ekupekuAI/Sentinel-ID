export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DashboardData {
  identity: { id: string; email: string; trustScore: number; riskLevel: string; decision: 'ALLOW' | 'VERIFY' | 'BLOCK'; confidenceLevel: number };
  session: { sessionId: string; location: string; ipAddress: string; timestamp: string } | null;
  risks: Array<{ id: string; description: string; detail: string; confidence: number }>;
  mfa: { enabled: boolean; primaryMethod: string; bypassAttemptsLast24h: number };
  device: { known: boolean; certificateValidation: string };
  threats: Array<{ id: string; name?: string; type?: string; description: string; confidence?: number; score?: number }>;
  activities: Array<{ timestamp: string; event: string; result: string; reason: string }>;
  actions: Array<{ id: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; action: string; description: string; estimatedTime: string }>;
  aiExplanation: { explanation: string; summary: string; recommendedAction: 'ALLOW' | 'VERIFY' | 'BLOCK'; source: 'gemini' | 'fallback' } | null;
  signals: { deviceTrust: number; behaviorPattern: number; locationIntelligence: number; threatIntelligence: number; historicalLoginPattern: number };
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: Severity;
  type: string;
  description: string;
  identity: string;
  action: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface UserProfile { fullName: string; email: string; jobTitle: string; department: string; }

export interface LedgerEntry {
  id: string; created_at: string; score: number; risk_level: string; decision: string; entry_hash: string; previous_hash: string | null; status: string; chain_index: number;
  polygon_transaction_hash: string | null; polygon_block_number: number | null; polygon_network: string | null; polygon_confirmations: number | null; polygon_status: string | null;
}
