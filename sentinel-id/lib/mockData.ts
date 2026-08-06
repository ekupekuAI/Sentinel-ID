// Mock data for SentinelID SOC Dashboard
export const mockIdentity = {
  id: 'USER_20250608_001',
  username: 'margaret.chen@securelbank.com',
  email: 'margaret.chen@securelbank.com',
  accountStatus: 'Active',
  trustScore: 78,
  riskLevel: 'REVIEW_REQUIRED',
  confidenceLevel: 0.94,
};

export const mockSession = {
  sessionId: 'SES_20250608_143552_AMD7K9',
  timestamp: '2025-06-08 14:35:52 UTC',
  ipAddress: '203.187.45.203',
  geoLocation: 'Singapore, SG',
  isp: 'Singtel Business',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0',
  deviceFingerprint: 'FP_A8F9C3D4E2B1',
  deviceType: 'Desktop',
  browser: 'Chrome 125',
  os: 'Windows 10',
  screenResolution: '2560x1440',
};

export const mockRiskFactors = [
  {
    id: 'RISK_001',
    category: 'Access Pattern Analysis',
    severity: 'MEDIUM',
    description: 'Anomalous Access Pattern Detected',
    detail: 'Login occurred at unusual time (2:35 AM) compared to typical work hours (9 AM - 5 PM)',
    confidence: 0.87,
    timestamp: '2025-06-08 14:35:52 UTC',
  },
  {
    id: 'RISK_002',
    category: 'Impossible Travel Detection',
    severity: 'HIGH',
    description: 'Impossible Travel Scenario Flagged',
    detail: 'Previous login from Tokyo, Japan (4 hours ago) → Current login from Singapore (3,600 km away). Physically impossible in 4 hours without commercial aviation.',
    confidence: 0.99,
    timestamp: '2025-06-08 14:35:52 UTC',
  },
  {
    id: 'RISK_003',
    category: 'Network Intelligence',
    severity: 'LOW',
    description: 'Session Originated from Tor Exit Node',
    detail: 'IP address registered as Tor exit node. Potential VPN/proxy usage or anonymous browsing.',
    confidence: 0.76,
    timestamp: '2025-06-08 14:35:52 UTC',
  },
];

export const mockMFAStatus = {
  enabled: true,
  primaryMethod: 'TOTP',
  secondaryMethod: 'SMS',
  lastMFAEvent: 'Success',
  lastMFATimestamp: '2025-06-08 14:35:45 UTC',
  bypassAttempts: 2,
  bypassAttemptsLast24h: 1,
};

export const mockDeviceFingerprint = {
  known: false,
  previousDevices: 12,
  firstSeenDate: null,
  trustLevel: 'UNKNOWN',
  tlsFingerprint: 'TLS_4B9F2A1E3C8D',
  ja3Fingerprint: 'JA3_92E4F1C8A5B3',
  hasBeenCompromised: false,
  certificateValidation: 'VALID',
};

export const mockThreatIntelligence = [
  {
    id: 'TI_001',
    type: 'APT Campaign',
    name: 'APT-Lazarus-Q2-2025',
    severity: 'CRITICAL',
    matched: true,
    description: 'Activity profile matches known Lazarus Group campaign targeting financial institutions',
    confidence: 0.92,
  },
  {
    id: 'TI_002',
    type: 'IP Reputation',
    ipAddress: '203.187.45.203',
    score: 68,
    severity: 'MEDIUM',
    description: 'IP has been flagged in 23 prior security incidents',
    threatCount: 23,
  },
];

export const mockSuspiciousActivities = [
  {
    timestamp: '2025-06-08 14:35:52 UTC',
    event: 'Login Attempt',
    result: 'FLAGGED',
    reason: 'Impossible travel scenario detected',
  },
  {
    timestamp: '2025-06-08 14:30:15 UTC',
    event: 'Multiple Failed MFA Attempts',
    result: 'BLOCKED',
    reason: '3 consecutive authentication failures',
  },
  {
    timestamp: '2025-06-08 14:25:00 UTC',
    event: 'Credential Transmission Alert',
    result: 'FLAGGED',
    reason: 'Credentials sent over unencrypted channel',
  },
  {
    timestamp: '2025-06-08 14:20:30 UTC',
    event: 'Account Enumeration Detected',
    result: 'BLOCKED',
    reason: 'Rapid validation attempts on multiple account names',
  },
];

export const mockInvestigativeActions = [
  {
    id: 'ACT_001',
    priority: 'HIGH',
    action: 'Require Step-Up Authentication',
    description: 'Initiate additional MFA challenge (FIDO2 security key)',
    estimatedTime: '2-5 minutes',
  },
  {
    id: 'ACT_002',
    priority: 'HIGH',
    action: 'Initiate Anomaly Investigation',
    description: 'Escalate to Tier 2 SOC for manual behavioral analysis',
    estimatedTime: '15-30 minutes',
  },
  {
    id: 'ACT_003',
    priority: 'MEDIUM',
    action: 'Terminate Existing Sessions',
    description: 'Force logout from all other devices for this identity',
    estimatedTime: 'Immediate',
  },
  {
    id: 'ACT_004',
    priority: 'MEDIUM',
    action: 'Monitor Account Activity',
    description: 'Enhanced logging for 24-hour period; alert on suspicious transactions',
    estimatedTime: 'Ongoing',
  },
];

export const mockRecentLogins = [
  {
    timestamp: '2025-06-08 14:35:52 UTC',
    location: 'Singapore, SG',
    ipAddress: '203.187.45.203',
    status: 'FLAGGED',
    trustScore: 78,
  },
  {
    timestamp: '2025-06-08 10:15:30 UTC',
    location: 'Tokyo, Japan',
    ipAddress: '210.43.192.88',
    status: 'APPROVED',
    trustScore: 92,
  },
  {
    timestamp: '2025-06-07 09:02:15 UTC',
    location: 'Singapore, SG',
    ipAddress: '203.187.45.203',
    status: 'APPROVED',
    trustScore: 95,
  },
  {
    timestamp: '2025-06-06 16:45:20 UTC',
    location: 'Singapore, SG',
    ipAddress: '203.187.45.203',
    status: 'APPROVED',
    trustScore: 96,
  },
];

export const mockAnalyticsData = {
  trustScoreTrend: [
    { date: 'Jun 1', value: 85, average: 80 },
    { date: 'Jun 2', value: 88, average: 82 },
    { date: 'Jun 3', value: 82, average: 81 },
    { date: 'Jun 4', value: 90, average: 83 },
    { date: 'Jun 5', value: 79, average: 82 },
    { date: 'Jun 6', value: 92, average: 83 },
    { date: 'Jun 7', value: 78, average: 82 },
    { date: 'Jun 8', value: 78, average: 81 },
  ],
  riskCategoryBreakdown: [
    { category: 'Access Pattern', value: 35 },
    { category: 'Device Risk', value: 25 },
    { category: 'Network Risk', value: 20 },
    { category: 'Behavioral Anomaly', value: 15 },
    { category: 'Other', value: 5 },
  ],
  alertsOverTime: [
    { hour: '12 AM', count: 2, critical: 0 },
    { hour: '4 AM', count: 5, critical: 1 },
    { hour: '8 AM', count: 12, critical: 2 },
    { hour: '12 PM', count: 8, critical: 1 },
    { hour: '4 PM', count: 15, critical: 3 },
    { hour: '8 PM', count: 10, critical: 2 },
  ],
  complianceStatus: [
    { regulation: 'PCI DSS', score: 94 },
    { regulation: 'SOX 404', score: 87 },
    { regulation: 'GDPR', score: 91 },
    { regulation: 'ISO 27001', score: 89 },
  ],
};
