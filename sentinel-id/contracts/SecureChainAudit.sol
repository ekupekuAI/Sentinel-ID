// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SecureChainAudit {
    struct AuditRecord {
        uint256 timestamp;
        uint256 trustScore;
        string riskLevel;
        string decision;
        bytes32 previousHash;
        bytes32 recordHash;
        address submitter;
    }

    address public owner;
    bytes32 public lastAuditHash;
    uint256 public auditCount;
    mapping(address => bool) public authorizedWriters;
    mapping(uint256 => AuditRecord) private records;

    event WriterAuthorizationUpdated(address indexed writer, bool authorized);
    event AuditRecorded(uint256 indexed auditId, bytes32 indexed recordHash, uint256 trustScore, string riskLevel, string decision);

    modifier onlyOwner() {
        require(msg.sender == owner, "SecureChain: owner only");
        _;
    }

    modifier onlyWriter() {
        require(authorizedWriters[msg.sender], "SecureChain: writer not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedWriters[msg.sender] = true;
        emit WriterAuthorizationUpdated(msg.sender, true);
    }

    function setWriter(address writer, bool authorized) external onlyOwner {
        require(writer != address(0), "SecureChain: zero writer");
        authorizedWriters[writer] = authorized;
        emit WriterAuthorizationUpdated(writer, authorized);
    }

    function recordAudit(uint256 trustScore, string calldata riskLevel, string calldata decision, bytes32 previousHash)
        external
        onlyWriter
        returns (uint256 auditId, bytes32 recordHash)
    {
        require(trustScore <= 100, "SecureChain: invalid score");
        require(bytes(riskLevel).length > 0 && bytes(riskLevel).length <= 32, "SecureChain: invalid risk");
        require(bytes(decision).length > 0 && bytes(decision).length <= 32, "SecureChain: invalid decision");
        require(previousHash == lastAuditHash, "SecureChain: previous hash mismatch");

        auditId = auditCount;
        recordHash = keccak256(abi.encode(auditId, block.timestamp, trustScore, riskLevel, decision, previousHash, msg.sender));
        records[auditId] = AuditRecord(block.timestamp, trustScore, riskLevel, decision, previousHash, recordHash, msg.sender);
        lastAuditHash = recordHash;
        auditCount = auditId + 1;
        emit AuditRecorded(auditId, recordHash, trustScore, riskLevel, decision);
    }

    function getAudit(uint256 auditId) external view returns (AuditRecord memory) {
        require(auditId < auditCount, "SecureChain: audit not found");
        return records[auditId];
    }
}
