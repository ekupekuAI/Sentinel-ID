export const secureChainAuditAbi = [
  'function owner() view returns (address)',
  'function lastAuditHash() view returns (bytes32)',
  'function auditCount() view returns (uint256)',
  'function authorizedWriters(address) view returns (bool)',
  'function setWriter(address writer, bool authorized)',
  'function recordAudit(uint256 trustScore, string riskLevel, string decision, bytes32 previousHash) returns (uint256 auditId, bytes32 recordHash)',
  'function getAudit(uint256 auditId) view returns (uint256 timestamp, uint256 trustScore, string riskLevel, string decision, bytes32 previousHash, bytes32 recordHash, address submitter)',
  'event AuditRecorded(uint256 indexed auditId, bytes32 indexed recordHash, uint256 trustScore, string riskLevel, string decision)',
] as const;
