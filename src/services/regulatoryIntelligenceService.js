const now = () => Date.now();

const minutesAgo = (minutes) => new Date(now() - minutes * 60 * 1000).toISOString();
const daysAgo = (days) => new Date(now() - days * 24 * 60 * 60 * 1000).toISOString();

const AUDIT_LOG_KEY = 'vaultscope_ai_audit_log';

export const roleProfiles = [
  {
    id: 'compliance_admin',
    label: 'Compliance Admin',
    description: 'Full regulatory intelligence, source, and evidence access',
    tools: ['sync_live_sources', 'plan_velocity', 'control_scan', 'gap_summary', 'audit_activity'],
    sourceAccess: ['sql_dw', 'jira_audit', 'grc_controls', 'bankos_core', 'custody_wallet', 'kri_stream', 'reg_library']
  },
  {
    id: 'audit_manager',
    label: 'Audit Manager',
    description: 'Can run audit velocity, control scans, and gap summaries',
    tools: ['plan_velocity', 'control_scan', 'gap_summary', 'audit_activity'],
    sourceAccess: ['sql_dw', 'jira_audit', 'grc_controls', 'kri_stream', 'reg_library']
  },
  {
    id: 'treasury_operator',
    label: 'Treasury Operator',
    description: 'Limited operational scan access for BankOS and custody controls',
    tools: ['control_scan'],
    sourceAccess: ['grc_controls', 'bankos_core', 'custody_wallet', 'reg_library']
  },
  {
    id: 'read_only',
    label: 'Read Only Reviewer',
    description: 'Can review summaries without querying restricted source records',
    tools: ['audit_activity'],
    sourceAccess: ['reg_library']
  }
];

export const mcpBridge = {
  endpoint: '/mcp/vaultscope',
  transport: 'SSE',
  version: '2026.05',
  serverName: 'vaultscope-data-foundation',
  tools: [
    {
      id: 'sync_live_sources',
      name: 'sync_live_sources',
      command: 'mcp.call("sync_live_sources", { sources: ["sql_dw", "jira_audit", "grc_controls"] })',
      description: 'Synchronizes SQL, Jira, GRC, BankOS, custody, KRI, and regulatory library records.'
    },
    {
      id: 'plan_velocity',
      name: 'run_plan_velocity_analysis',
      command: 'mcp.call("run_plan_velocity_analysis", { period: "rolling_90d" })',
      description: 'Builds plan velocity and finding trend reports from active and historical audits.'
    },
    {
      id: 'control_scan',
      name: 'scan_control_status',
      command: 'mcp.call("scan_control_status", { frameworks: ["SOC 2", "ISO 27001", "SPK III-35/B.1", "MASAK AML/CTF"], scope: "bankos_custody" })',
      description: 'Scans mapped control status across SOC 2, ISO 27001, SPK, and MASAK obligations.'
    },
    {
      id: 'gap_summary',
      name: 'generate_gap_summary',
      command: 'mcp.call("generate_gap_summary", { compare: ["technical_controls", "regulatory_requirements"] })',
      description: 'Produces traceable gap summaries between technical architecture and regulatory requirements.'
    },
    {
      id: 'audit_activity',
      name: 'get_ai_audit_activity',
      command: 'mcp.call("get_ai_audit_activity", { limit: 25 })',
      description: 'Returns AI query and activity history for access review cycles.'
    }
  ]
};

const dataSourceTemplates = [
  {
    id: 'sql_dw',
    label: 'Audit SQL Warehouse',
    system: 'PostgreSQL',
    adapter: 'MCP SQL read replica',
    freshnessMinutes: 7,
    schemaVersion: 'audit_analytics.v3',
    records: 1482,
    status: 'live',
    governance: 'row-level policy: audit.analytics.read',
    description: 'Active and historical audit plans, finding age, evidence SLA, and remediation records.'
  },
  {
    id: 'jira_audit',
    label: 'Jira Audit Findings',
    system: 'Jira',
    adapter: 'MCP Jira connector',
    freshnessMinutes: 12,
    schemaVersion: 'jira_findings.v2',
    records: 236,
    status: 'live',
    governance: 'project ACL: AUDIT, GRC',
    description: 'Fragmented findings, issue owners, due dates, blockers, and remediation workflow status.'
  },
  {
    id: 'grc_controls',
    label: 'GRC Control Registry',
    system: 'GRC Platform',
    adapter: 'MCP GRC connector',
    freshnessMinutes: 18,
    schemaVersion: 'control_registry.v5',
    records: 412,
    status: 'live',
    governance: 'control owner approval + SoD policy',
    description: 'Control design, test status, exceptions, evidence links, and framework mappings.'
  },
  {
    id: 'bankos_core',
    label: 'BankOS Core Banking',
    system: 'BankOS',
    adapter: 'MCP core banking read model',
    freshnessMinutes: 35,
    schemaVersion: 'bankos_controls.v1',
    records: 96,
    status: 'live',
    governance: 'least privilege: bankos.control.read',
    description: 'Core banking reconciliation, maker-checker, settlement, and incident control telemetry.'
  },
  {
    id: 'custody_wallet',
    label: 'Custody Wallet Infrastructure',
    system: 'Wallet Platform',
    adapter: 'MCP custody evidence bridge',
    freshnessMinutes: 22,
    schemaVersion: 'custody_evidence.v4',
    records: 128,
    status: 'live',
    governance: 'segregated custody evidence scope',
    description: 'MPC key ceremony, address allowlist, withdrawal approval, and cold wallet evidence.'
  },
  {
    id: 'kri_stream',
    label: 'Operational KRI Stream',
    system: 'Risk Metrics Lake',
    adapter: 'MCP KRI event stream',
    freshnessMinutes: 5,
    schemaVersion: 'kri_signals.v2',
    records: 64,
    status: 'live',
    governance: 'risk metrics read role',
    description: 'Operational failure signals, delayed evidence, reconciliation breaks, and overdue audit tasks.'
  },
  {
    id: 'reg_library',
    label: 'Regulatory Library',
    system: 'Policy Knowledge Base',
    adapter: 'MCP regulation retrieval',
    freshnessMinutes: 240,
    schemaVersion: 'regulatory_library.v6',
    records: 54,
    status: 'archive-aware',
    governance: 'approved obligations only; superseded docs archived',
    description: 'Current SPK III-35/B.1, MASAK AML/CTF, SOC 2, ISO 27001, BankOS, and custody clauses.'
  }
];

export const regulatoryLibrary = [
  {
    id: 'SPK-III-35B1-17',
    framework: 'SPK III-35/B.1',
    article: 'Madde 17',
    title: 'Information systems control environment',
    status: 'active',
    effectiveDate: '2025-01-01',
    sourceRecord: 'REG-SPK-35B1-0017',
    appliesTo: ['bankos_core', 'custody_wallet', 'grc_controls'],
    controlThemes: ['core banking architecture', 'access governance', 'change evidence'],
    summary: 'Core banking and custody control design must be documented, tested, and traceable to approved responsibilities.'
  },
  {
    id: 'SPK-III-35B1-22',
    framework: 'SPK III-35/B.1',
    article: 'Madde 22',
    title: 'Custody, segregation, and operational continuity',
    status: 'active',
    effectiveDate: '2025-01-01',
    sourceRecord: 'REG-SPK-35B1-0022',
    appliesTo: ['custody_wallet', 'bankos_core'],
    controlThemes: ['custody segregation', 'continuity', 'evidence retention'],
    summary: 'Client assets, custody keys, and continuity procedures require segregation, monitoring, and documented evidence.'
  },
  {
    id: 'MASAK-AMLCTF-5',
    framework: 'MASAK AML/CTF',
    article: 'Program Yukumlulugu 5',
    title: 'AML/CTF monitoring and escalation program',
    status: 'active',
    effectiveDate: '2025-03-01',
    sourceRecord: 'REG-MASAK-AMLCTF-0005',
    appliesTo: ['sql_dw', 'jira_audit', 'grc_controls', 'kri_stream'],
    controlThemes: ['transaction monitoring', 'suspicious activity escalation', 'training evidence'],
    summary: 'AML/CTF program controls must detect suspicious activity, evidence escalation, and preserve review history.'
  },
  {
    id: 'MASAK-AMLCTF-9',
    framework: 'MASAK AML/CTF',
    article: 'Program Yukumlulugu 9',
    title: 'Risk-based review cadence',
    status: 'active',
    effectiveDate: '2025-03-01',
    sourceRecord: 'REG-MASAK-AMLCTF-0009',
    appliesTo: ['kri_stream', 'grc_controls'],
    controlThemes: ['KRI monitoring', 'delayed process escalation', 'risk acceptance'],
    summary: 'Risk indicators and overdue control reviews must trigger documented escalation and accountable closure.'
  },
  {
    id: 'SOC2-CC7.2',
    framework: 'SOC 2',
    article: 'CC7.2',
    title: 'Security event monitoring',
    status: 'active',
    effectiveDate: '2024-10-01',
    sourceRecord: 'REG-SOC2-CC7-2',
    appliesTo: ['kri_stream', 'custody_wallet'],
    controlThemes: ['security monitoring', 'incident review'],
    summary: 'Security events are monitored, evaluated, and escalated according to severity.'
  },
  {
    id: 'ISO27001-A.5.15',
    framework: 'ISO 27001',
    article: 'A.5.15',
    title: 'Access control',
    status: 'active',
    effectiveDate: '2024-09-15',
    sourceRecord: 'REG-ISO27001-A-5-15',
    appliesTo: ['bankos_core', 'custody_wallet', 'grc_controls'],
    controlThemes: ['access review', 'least privilege'],
    summary: 'Access to information and associated assets is controlled according to business and security requirements.'
  },
  {
    id: 'SPK-III-35B1-DRAFT-2024',
    framework: 'SPK III-35/B.1',
    article: 'Draft 2024 appendix',
    title: 'Superseded draft custody appendix',
    status: 'superseded',
    supersededBy: 'SPK-III-35B1-22',
    sourceRecord: 'ARCHIVE-SPK-DRAFT-2024',
    appliesTo: ['custody_wallet'],
    controlThemes: ['archived reference'],
    summary: 'Archived draft retained only for traceability; analysis quality is penalized if cited as current authority.'
  }
];

const auditFindings = [
  {
    id: 'JIRA-AUD-431',
    source: 'jira_audit',
    title: 'Quarterly access review evidence overdue',
    severity: 'high',
    status: 'open',
    dueDate: daysAgo(-2),
    updatedAt: minutesAgo(14),
    owner: 'Access Governance',
    linkedControls: ['CTRL-ACCESS-002'],
    regulationRefs: ['ISO27001-A.5.15', 'SPK-III-35B1-17']
  },
  {
    id: 'GRC-FND-118',
    source: 'grc_controls',
    title: 'Custody wallet withdrawal approval test failed',
    severity: 'critical',
    status: 'in remediation',
    dueDate: daysAgo(5),
    updatedAt: minutesAgo(19),
    owner: 'Custody Operations',
    linkedControls: ['CTRL-CUST-004'],
    regulationRefs: ['SPK-III-35B1-22', 'MASAK-AMLCTF-5']
  },
  {
    id: 'SQL-AUD-908',
    source: 'sql_dw',
    title: 'AML model threshold review completed late',
    severity: 'medium',
    status: 'closed',
    dueDate: daysAgo(12),
    updatedAt: minutesAgo(9),
    owner: 'Financial Crime',
    linkedControls: ['CTRL-AML-001'],
    regulationRefs: ['MASAK-AMLCTF-5']
  },
  {
    id: 'JIRA-AUD-419',
    source: 'jira_audit',
    title: 'BankOS settlement reconciliation owner missing backup approver',
    severity: 'high',
    status: 'open',
    dueDate: daysAgo(1),
    updatedAt: minutesAgo(31),
    owner: 'BankOS Platform',
    linkedControls: ['CTRL-BANKOS-003'],
    regulationRefs: ['SPK-III-35B1-17']
  }
];

const auditProcesses = [
  {
    id: 'AUD-2026-Q2-AML',
    name: 'MASAK AML/CTF Program Review',
    phase: 'fieldwork',
    plannedDays: 18,
    actualDays: 22,
    findingsOpened: 9,
    findingsClosed: 5,
    delayedEvidenceItems: 3,
    source: 'sql_dw'
  },
  {
    id: 'AUD-2026-Q2-CUSTODY',
    name: 'Custody Wallet Control Test',
    phase: 'evidence collection',
    plannedDays: 12,
    actualDays: 16,
    findingsOpened: 6,
    findingsClosed: 2,
    delayedEvidenceItems: 4,
    source: 'grc_controls'
  },
  {
    id: 'AUD-2026-Q1-BANKOS',
    name: 'BankOS Core Banking Architecture Review',
    phase: 'closed',
    plannedDays: 20,
    actualDays: 19,
    findingsOpened: 7,
    findingsClosed: 7,
    delayedEvidenceItems: 1,
    source: 'sql_dw'
  },
  {
    id: 'AUD-2025-Q4-SOC2',
    name: 'SOC 2 Security Monitoring Review',
    phase: 'closed',
    plannedDays: 14,
    actualDays: 13,
    findingsOpened: 4,
    findingsClosed: 4,
    delayedEvidenceItems: 0,
    source: 'sql_dw'
  }
];

const controls = [
  {
    id: 'CTRL-AML-001',
    name: 'AML suspicious activity monitoring and escalation',
    domain: 'Financial Crime',
    scope: 'transaction_monitoring',
    status: 'effective',
    automation: 86,
    owner: 'Financial Crime',
    updatedAt: minutesAgo(11),
    sources: ['sql_dw', 'grc_controls', 'kri_stream'],
    frameworks: ['MASAK AML/CTF', 'SOC 2'],
    requirementRefs: ['MASAK-AMLCTF-5', 'SOC2-CC7.2'],
    evidence: ['SQL-AUD-908', 'KRI-AML-015']
  },
  {
    id: 'CTRL-BANKOS-003',
    name: 'BankOS settlement reconciliation maker-checker',
    domain: 'Core Banking',
    scope: 'bankos_core',
    status: 'needs_attention',
    automation: 62,
    owner: 'BankOS Platform',
    updatedAt: minutesAgo(36),
    sources: ['bankos_core', 'jira_audit', 'grc_controls'],
    frameworks: ['SPK III-35/B.1', 'ISO 27001'],
    requirementRefs: ['SPK-III-35B1-17', 'ISO27001-A.5.15'],
    evidence: ['JIRA-AUD-419', 'BANKOS-REC-221']
  },
  {
    id: 'CTRL-CUST-004',
    name: 'Custody withdrawal approval and key ceremony evidence',
    domain: 'Custody',
    scope: 'custody_wallet',
    status: 'gap',
    automation: 48,
    owner: 'Custody Operations',
    updatedAt: minutesAgo(25),
    sources: ['custody_wallet', 'grc_controls', 'jira_audit'],
    frameworks: ['SPK III-35/B.1', 'MASAK AML/CTF', 'SOC 2'],
    requirementRefs: ['SPK-III-35B1-22', 'MASAK-AMLCTF-5', 'SOC2-CC7.2'],
    evidence: ['GRC-FND-118', 'CUST-EVD-784']
  },
  {
    id: 'CTRL-ACCESS-002',
    name: 'Privileged access review and least privilege attestation',
    domain: 'Access Governance',
    scope: 'enterprise_access',
    status: 'needs_attention',
    automation: 58,
    owner: 'Access Governance',
    updatedAt: minutesAgo(20),
    sources: ['grc_controls', 'jira_audit'],
    frameworks: ['ISO 27001', 'SPK III-35/B.1'],
    requirementRefs: ['ISO27001-A.5.15', 'SPK-III-35B1-17'],
    evidence: ['JIRA-AUD-431', 'GRC-ACCESS-620']
  },
  {
    id: 'CTRL-KRI-006',
    name: 'Delayed audit process KRI escalation',
    domain: 'Operational Risk',
    scope: 'kri_stream',
    status: 'effective',
    automation: 78,
    owner: 'Operational Risk',
    updatedAt: minutesAgo(6),
    sources: ['kri_stream', 'sql_dw'],
    frameworks: ['MASAK AML/CTF', 'SOC 2'],
    requirementRefs: ['MASAK-AMLCTF-9', 'SOC2-CC7.2'],
    evidence: ['KRI-AUD-022', 'SQL-AUD-VELOCITY']
  }
];

const kriSignals = [
  {
    id: 'KRI-AUD-022',
    source: 'kri_stream',
    indicator: 'Delayed evidence items',
    value: 7,
    threshold: 5,
    severity: 'high',
    updatedAt: minutesAgo(5),
    linkedProcess: 'AUD-2026-Q2-CUSTODY',
    regulationRefs: ['MASAK-AMLCTF-9', 'SPK-III-35B1-22']
  },
  {
    id: 'KRI-BANKOS-014',
    source: 'bankos_core',
    indicator: 'Settlement reconciliation breaks',
    value: 4,
    threshold: 2,
    severity: 'high',
    updatedAt: minutesAgo(34),
    linkedProcess: 'AUD-2026-Q1-BANKOS',
    regulationRefs: ['SPK-III-35B1-17']
  },
  {
    id: 'KRI-AML-015',
    source: 'kri_stream',
    indicator: 'AML alert review SLA breach rate',
    value: 9,
    threshold: 8,
    severity: 'medium',
    updatedAt: minutesAgo(8),
    linkedProcess: 'AUD-2026-Q2-AML',
    regulationRefs: ['MASAK-AMLCTF-5']
  }
];

const seedAuditEntries = [
  {
    id: 'AIQ-SEED-001',
    timestamp: minutesAgo(42),
    actor: 'system.bootstrap',
    role: 'compliance_admin',
    action: 'sync_live_sources',
    tool: 'sync_live_sources',
    outcome: 'allowed',
    sources: ['sql_dw', 'jira_audit', 'grc_controls', 'reg_library'],
    traceId: 'TRACE-SYNC-001'
  },
  {
    id: 'AIQ-SEED-002',
    timestamp: minutesAgo(28),
    actor: 'mike.chen@vaultscope.local',
    role: 'audit_manager',
    action: 'plan_velocity',
    tool: 'run_plan_velocity_analysis',
    outcome: 'allowed',
    sources: ['sql_dw', 'jira_audit', 'grc_controls', 'kri_stream'],
    traceId: 'TRACE-PLAN-002'
  },
  {
    id: 'AIQ-SEED-003',
    timestamp: minutesAgo(17),
    actor: 'readonly.reviewer@vaultscope.local',
    role: 'read_only',
    action: 'gap_summary',
    tool: 'generate_gap_summary',
    outcome: 'denied',
    sources: [],
    traceId: 'TRACE-DENY-003'
  }
];

const getRole = (roleId = 'compliance_admin') =>
  roleProfiles.find((role) => role.id === roleId) || roleProfiles[0];

const hydrateDataSources = () =>
  dataSourceTemplates.map((source) => ({
    ...source,
    lastSyncedAt: minutesAgo(source.freshnessMinutes),
    accessibleRoles: roleProfiles
      .filter((role) => role.sourceAccess.includes(source.id))
      .map((role) => role.id)
  }));

const scoreFreshness = (minutes) => {
  if (minutes <= 15) return 100;
  if (minutes <= 30) return 92;
  if (minutes <= 60) return 78;
  if (minutes <= 240) return 64;
  return 45;
};

const buildQuality = ({ sourceIds, evidence, requirementRefs }) => {
  const sources = hydrateDataSources().filter((source) => sourceIds.includes(source.id));
  const freshnessScore = Math.round(
    sources.reduce((total, source) => total + scoreFreshness(source.freshnessMinutes), 0) / sources.length
  );
  const schemaScore = Math.round(
    sources.reduce((total, source) => total + (source.schemaVersion ? 96 : 55), 0) / sources.length
  );
  const activeRequirements = regulatoryLibrary.filter(
    (requirement) => requirementRefs.includes(requirement.id) && requirement.status === 'active'
  );
  const supersededRequirements = regulatoryLibrary.filter(
    (requirement) => requirementRefs.includes(requirement.id) && requirement.status !== 'active'
  );
  const traceabilityScore = Math.min(100, Math.round(((evidence.length + activeRequirements.length) / 8) * 100));
  const archivePenalty = supersededRequirements.length * 12;
  const score = Math.max(
    0,
    Math.round(freshnessScore * 0.35 + schemaScore * 0.25 + traceabilityScore * 0.3 + 92 * 0.1 - archivePenalty)
  );

  return {
    score,
    rating: score >= 90 ? 'audit-ready' : score >= 75 ? 'usable with review' : 'requires remediation',
    freshnessScore,
    schemaScore,
    traceabilityScore,
    archivePenalty,
    activeRequirementCount: activeRequirements.length,
    supersededRequirementCount: supersededRequirements.length,
    drivers: [
      `${sources.length} live source(s) queried through MCP`,
      `${evidence.length} source record(s) linked for traceability`,
      `${activeRequirements.length} active regulatory article(s) cited`,
      supersededRequirements.length
        ? `${supersededRequirements.length} superseded document(s) archived and excluded from authority`
        : 'Superseded documentation archived with no current-authority citations'
    ]
  };
};

const buildEvidence = ({ sourceIds, recordIds, requirementRefs }) => {
  const sources = hydrateDataSources().filter((source) => sourceIds.includes(source.id));
  const requirements = regulatoryLibrary.filter((requirement) => requirementRefs.includes(requirement.id));

  return [
    ...recordIds.map((recordId) => {
      const finding = auditFindings.find((item) => item.id === recordId);
      const kri = kriSignals.find((item) => item.id === recordId);
      const control = controls.find((item) => item.id === recordId);
      const record = finding || kri || control;

      return {
        recordId,
        source: record?.source || record?.sources?.[0] || 'grc_controls',
        type: finding ? 'finding' : kri ? 'kri_signal' : control ? 'control' : 'source_record',
        updatedAt: record?.updatedAt || minutesAgo(20),
        title: record?.title || record?.indicator || record?.name || 'Source evidence record'
      };
    }),
    ...requirements.map((requirement) => ({
      recordId: requirement.sourceRecord,
      source: 'reg_library',
      type: requirement.status === 'active' ? 'regulatory_article' : 'archived_regulatory_article',
      updatedAt: requirement.effectiveDate,
      title: `${requirement.framework} ${requirement.article}: ${requirement.title}`
    })),
    ...sources.map((source) => ({
      recordId: `SYNC-${source.id.toUpperCase()}`,
      source: source.id,
      type: 'mcp_source_sync',
      updatedAt: source.lastSyncedAt,
      title: `${source.label} schema ${source.schemaVersion}`
    }))
  ];
};

const createReport = ({ workflowId, roleId, title, tool, sourceIds, recordIds, requirementRefs, summary, metrics, sections }) => {
  const role = getRole(roleId);
  const evidence = buildEvidence({ sourceIds, recordIds, requirementRefs });
  const quality = buildQuality({ sourceIds, evidence, requirementRefs });
  const traceId = `TRACE-${workflowId.toUpperCase()}-${Math.floor(now() / 1000)}`;

  return {
    id: `RPT-${workflowId.toUpperCase()}-${new Date().toISOString().slice(0, 10)}`,
    traceId,
    workflowId,
    title,
    generatedAt: new Date().toISOString(),
    mcpTool: tool,
    role: role.label,
    endpoint: mcpBridge.endpoint,
    summary,
    metrics,
    sections,
    quality,
    evidence,
    dataLineage: hydrateDataSources()
      .filter((source) => sourceIds.includes(source.id))
      .map((source) => ({
        sourceId: source.id,
        label: source.label,
        system: source.system,
        lastSyncedAt: source.lastSyncedAt,
        schemaVersion: source.schemaVersion,
        records: source.records
      }))
  };
};

const deniedReport = ({ roleId, workflowId, tool }) => {
  const role = getRole(roleId);
  const traceId = `TRACE-DENY-${Math.floor(now() / 1000)}`;

  return {
    accessDenied: true,
    traceId,
    workflowId,
    title: 'Access denied',
    generatedAt: new Date().toISOString(),
    mcpTool: tool,
    role: role.label,
    summary: `${role.label} is not authorized to execute ${tool}. Query was blocked before source access.`,
    quality: {
      score: 0,
      rating: 'blocked by RBAC',
      drivers: ['No data source was queried because role-based access control denied the tool invocation.']
    },
    evidence: []
  };
};

export const getCurrentUserProfile = () => {
  try {
    const rawUser = localStorage.getItem('vaultscope_user');
    const user = rawUser ? JSON.parse(rawUser) : null;
    return {
      email: user?.email || 'john.doe@vaultscope.local',
      name: user?.name || 'John Doe',
      company: user?.company || 'Crypto Corp',
      roleId: user?.roleId || 'compliance_admin'
    };
  } catch (error) {
    return {
      email: 'john.doe@vaultscope.local',
      name: 'John Doe',
      company: 'Crypto Corp',
      roleId: 'compliance_admin'
    };
  }
};

export const canExecuteTool = (roleId, toolId) => getRole(roleId).tools.includes(toolId);

export const getAccessibleSources = (roleId) => {
  const role = getRole(roleId);
  return hydrateDataSources().map((source) => ({
    ...source,
    isAccessible: role.sourceAccess.includes(source.id)
  }));
};

export const getFoundationState = (roleId = 'compliance_admin') => {
  const role = getRole(roleId);
  const sources = getAccessibleSources(roleId);
  const accessibleSourceCount = sources.filter((source) => source.isAccessible).length;

  return {
    role,
    bridge: mcpBridge,
    sources,
    regulatoryLibrary,
    activeRequirements: regulatoryLibrary.filter((requirement) => requirement.status === 'active'),
    archivedRequirements: regulatoryLibrary.filter((requirement) => requirement.status !== 'active'),
    controls,
    kriSignals,
    auditProcesses,
    sourceCoverage: Math.round((accessibleSourceCount / sources.length) * 100)
  };
};

export const getAiActivityLog = () => {
  try {
    const storedEntries = localStorage.getItem(AUDIT_LOG_KEY);
    return storedEntries ? JSON.parse(storedEntries) : seedAuditEntries;
  } catch (error) {
    return seedAuditEntries;
  }
};

export const logAiActivity = ({ actor, roleId, action, tool, outcome, sources = [], traceId }) => {
  const role = getRole(roleId);
  const entry = {
    id: `AIQ-${Math.floor(now() / 1000)}-${Math.random().toString(16).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    actor,
    role: role.id,
    action,
    tool,
    outcome,
    sources,
    traceId
  };

  try {
    const nextEntries = [entry, ...getAiActivityLog()].slice(0, 25);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(nextEntries));
  } catch (error) {
    // Audit logging is best-effort in the browser demo; production should write to immutable storage.
  }

  return entry;
};

const runPlanVelocityAnalysis = (roleId) => {
  const sourceIds = ['sql_dw', 'jira_audit', 'grc_controls', 'kri_stream'];
  const recordIds = ['JIRA-AUD-431', 'GRC-FND-118', 'SQL-AUD-908', 'KRI-AUD-022', 'KRI-AML-015'];
  const requirementRefs = ['MASAK-AMLCTF-5', 'MASAK-AMLCTF-9', 'SPK-III-35B1-17', 'SPK-III-35B1-22'];
  const activeAudits = auditProcesses.filter((process) => process.phase !== 'closed');
  const totalPlanned = auditProcesses.reduce((total, process) => total + process.plannedDays, 0);
  const totalActual = auditProcesses.reduce((total, process) => total + process.actualDays, 0);
  const overdueFindings = auditFindings.filter((finding) => finding.status !== 'closed' && new Date(finding.dueDate) < new Date());
  const delayedEvidence = activeAudits.reduce((total, process) => total + process.delayedEvidenceItems, 0);

  return createReport({
    workflowId: 'plan_velocity',
    roleId,
    title: 'Plan Velocity and Finding Trend Analysis',
    tool: 'run_plan_velocity_analysis',
    sourceIds,
    recordIds,
    requirementRefs,
    summary: 'Active and historical audit records show reduced plan velocity in custody and AML reviews, with KRI-triggered evidence delays requiring escalation.',
    metrics: [
      { label: 'Plan velocity', value: `${Math.round((totalPlanned / totalActual) * 100)}%`, tone: 'warning' },
      { label: 'Active audits', value: activeAudits.length, tone: 'accent' },
      { label: 'Overdue findings', value: overdueFindings.length, tone: overdueFindings.length ? 'error' : 'success' },
      { label: 'Delayed evidence', value: delayedEvidence, tone: delayedEvidence > 5 ? 'error' : 'warning' }
    ],
    sections: [
      {
        heading: 'Trend observations',
        items: [
          'Custody audit exceeded plan by 4 days and has 4 delayed evidence items.',
          'MASAK AML/CTF fieldwork is running at 82% velocity with 3 delayed evidence items.',
          'Closed BankOS and SOC 2 audits met plan, creating a baseline for remediation pacing.'
        ]
      },
      {
        heading: 'Proactive KRI detections',
        items: kriSignals.map(
          (signal) => `${signal.id}: ${signal.indicator} is ${signal.value} versus threshold ${signal.threshold} (${signal.severity}).`
        )
      }
    ]
  });
};

const runControlScan = (roleId) => {
  const sourceIds = ['grc_controls', 'bankos_core', 'custody_wallet', 'kri_stream', 'reg_library'];
  const recordIds = controls.map((control) => control.id);
  const requirementRefs = [...new Set(controls.flatMap((control) => control.requirementRefs))];
  const gapCount = controls.filter((control) => control.status === 'gap').length;
  const attentionCount = controls.filter((control) => control.status === 'needs_attention').length;

  return createReport({
    workflowId: 'control_scan',
    roleId,
    title: 'Cross-Framework Control Scan',
    tool: 'scan_control_status',
    sourceIds,
    recordIds,
    requirementRefs,
    summary: 'Single-command scan mapped BankOS and custody controls across SOC 2, ISO 27001, SPK III-35/B.1, and MASAK AML/CTF.',
    metrics: [
      { label: 'Controls scanned', value: controls.length, tone: 'accent' },
      { label: 'Effective', value: controls.filter((control) => control.status === 'effective').length, tone: 'success' },
      { label: 'Needs attention', value: attentionCount, tone: attentionCount ? 'warning' : 'success' },
      { label: 'Gaps', value: gapCount, tone: gapCount ? 'error' : 'success' }
    ],
    sections: [
      {
        heading: 'Control status by scope',
        items: controls.map(
          (control) =>
            `${control.id}: ${control.name} is ${control.status.replace('_', ' ')} across ${control.frameworks.join(', ')}.`
        )
      },
      {
        heading: 'BankOS and custody regulatory cross-check',
        items: [
          'BankOS settlement reconciliation maps to SPK III-35/B.1 Madde 17 and ISO 27001 A.5.15.',
          'Custody withdrawal approval maps to SPK III-35/B.1 Madde 22, MASAK AML/CTF Program 5, and SOC 2 CC7.2.'
        ]
      }
    ]
  });
};

const runGapSummary = (roleId) => {
  const sourceIds = ['sql_dw', 'jira_audit', 'grc_controls', 'bankos_core', 'custody_wallet', 'kri_stream', 'reg_library'];
  const recordIds = ['GRC-FND-118', 'JIRA-AUD-431', 'JIRA-AUD-419', 'KRI-AUD-022', 'KRI-BANKOS-014'];
  const requirementRefs = ['SPK-III-35B1-17', 'SPK-III-35B1-22', 'MASAK-AMLCTF-5', 'MASAK-AMLCTF-9', 'ISO27001-A.5.15'];
  const gaps = [
    {
      id: 'GAP-CUST-001',
      severity: 'critical',
      title: 'Custody withdrawal approval evidence is incomplete',
      delta: 'Technical approval workflow exists, but current evidence does not prove dual approval and key ceremony linkage.',
      remediation: 'Bind wallet approval events to GRC evidence records and require MPC ceremony trace IDs for each exception.',
      refs: ['SPK-III-35B1-22', 'MASAK-AMLCTF-5', 'GRC-FND-118']
    },
    {
      id: 'GAP-BANKOS-002',
      severity: 'high',
      title: 'BankOS reconciliation backup approver is not assigned',
      delta: 'Core reconciliation control lacks backup approver coverage for delayed settlement exceptions.',
      remediation: 'Add backup approver ownership and KRI escalation for breaks above threshold.',
      refs: ['SPK-III-35B1-17', 'JIRA-AUD-419', 'KRI-BANKOS-014']
    },
    {
      id: 'GAP-ACCESS-003',
      severity: 'high',
      title: 'Privileged access review evidence is overdue',
      delta: 'Access control design is mapped, but attestation evidence missed the review window.',
      remediation: 'Trigger access review campaign and block report quality promotion until evidence is current.',
      refs: ['ISO27001-A.5.15', 'SPK-III-35B1-17', 'JIRA-AUD-431']
    }
  ];

  return createReport({
    workflowId: 'gap_summary',
    roleId,
    title: 'Automated Technical-to-Regulatory Gap Summary',
    tool: 'generate_gap_summary',
    sourceIds,
    recordIds,
    requirementRefs,
    summary: 'Gap summary links technical infrastructure deltas to active regulatory requirements, with archived documentation excluded from current authority.',
    metrics: [
      { label: 'Critical gaps', value: gaps.filter((gap) => gap.severity === 'critical').length, tone: 'error' },
      { label: 'High gaps', value: gaps.filter((gap) => gap.severity === 'high').length, tone: 'warning' },
      { label: 'Traceable refs', value: gaps.reduce((total, gap) => total + gap.refs.length, 0), tone: 'accent' },
      { label: 'Archived docs excluded', value: regulatoryLibrary.filter((item) => item.status !== 'active').length, tone: 'success' }
    ],
    sections: [
      {
        heading: 'Gap summary',
        items: gaps.map((gap) => `${gap.id}: ${gap.title} - ${gap.delta}`)
      },
      {
        heading: 'Recommended remediation',
        items: gaps.map((gap) => `${gap.id}: ${gap.remediation}`)
      }
    ],
    gaps
  });
};

export const runWorkflow = ({ workflowId, roleId, actor }) => {
  const toolByWorkflow = {
    plan_velocity: 'run_plan_velocity_analysis',
    control_scan: 'scan_control_status',
    gap_summary: 'generate_gap_summary'
  };

  if (!canExecuteTool(roleId, workflowId)) {
    const denied = deniedReport({ roleId, workflowId, tool: toolByWorkflow[workflowId] });
    logAiActivity({
      actor,
      roleId,
      action: workflowId,
      tool: toolByWorkflow[workflowId],
      outcome: 'denied',
      traceId: denied.traceId
    });
    return denied;
  }

  const reportByWorkflow = {
    plan_velocity: runPlanVelocityAnalysis,
    control_scan: runControlScan,
    gap_summary: runGapSummary
  };
  const report = reportByWorkflow[workflowId](roleId);
  logAiActivity({
    actor,
    roleId,
    action: workflowId,
    tool: report.mcpTool,
    outcome: 'allowed',
    sources: report.dataLineage.map((source) => source.sourceId),
    traceId: report.traceId
  });
  return report;
};
