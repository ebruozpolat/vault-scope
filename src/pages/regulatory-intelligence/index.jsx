import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';
import {
  canExecuteTool,
  getAiActivityLog,
  getCurrentUserProfile,
  getFoundationState,
  logAiActivity,
  roleProfiles,
  runWorkflow
} from '../../services/regulatoryIntelligenceService';

const workflowCards = [
  {
    id: 'plan_velocity',
    title: 'Plan Velocity Analysis',
    icon: 'Gauge',
    description: 'Query active and historical audits to report plan speed, overdue evidence, and finding trends.',
    command: 'run_plan_velocity_analysis --period rolling_90d'
  },
  {
    id: 'control_scan',
    title: 'Control Scan',
    icon: 'ScanSearch',
    description: 'Scan SOC 2, ISO 27001, SPK III-35/B.1, MASAK AML/CTF, BankOS, and custody controls in one command.',
    command: 'scan_control_status --frameworks all --scope bankos,custody'
  },
  {
    id: 'gap_summary',
    title: 'Gap Summary',
    icon: 'FileWarning',
    description: 'Compare technical architecture controls with regulatory obligations and produce traceable deltas.',
    command: 'generate_gap_summary --compare technical_controls,regulatory_requirements'
  }
];

const toneClasses = {
  success: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  error: 'text-error bg-error/10 border-error/20',
  accent: 'text-accent bg-accent/10 border-accent/20',
  muted: 'text-muted-foreground bg-muted border-border'
};

const statusClasses = {
  live: 'text-success bg-success/10 border-success/20',
  'archive-aware': 'text-accent bg-accent/10 border-accent/20',
  active: 'text-success bg-success/10 border-success/20',
  superseded: 'text-warning bg-warning/10 border-warning/20',
  effective: 'text-success bg-success/10 border-success/20',
  needs_attention: 'text-warning bg-warning/10 border-warning/20',
  gap: 'text-error bg-error/10 border-error/20',
  allowed: 'text-success bg-success/10 border-success/20',
  denied: 'text-error bg-error/10 border-error/20'
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const StatusBadge = ({ value, children }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
      statusClasses[value] || toneClasses.muted
    )}
  >
    {children || String(value).replace(/_/g, ' ')}
  </span>
);

const MetricCard = ({ metric }) => (
  <div className={cn('rounded-lg border p-4', toneClasses[metric.tone] || toneClasses.muted)}>
    <p className="text-xs font-medium uppercase tracking-wide opacity-80">{metric.label}</p>
    <p className="mt-2 text-2xl font-bold">{metric.value}</p>
  </div>
);

const RegulatoryIntelligence = () => {
  const currentUser = useMemo(() => getCurrentUserProfile(), []);
  const [selectedRole, setSelectedRole] = useState(currentUser.roleId);
  const [activeReport, setActiveReport] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [syncState, setSyncState] = useState('idle');

  const foundation = useMemo(() => getFoundationState(selectedRole), [selectedRole, syncState]);
  const roleOptions = roleProfiles.map((role) => ({ value: role.id, label: role.label }));
  const availableTools = foundation.bridge.tools.map((tool) => ({
    ...tool,
    allowed: canExecuteTool(selectedRole, tool.id)
  }));
  const kriBreaches = foundation.kriSignals.filter((signal) => signal.value > signal.threshold);

  useEffect(() => {
    setActivityLog(getAiActivityLog());
  }, []);

  const refreshActivityLog = () => {
    setActivityLog(getAiActivityLog());
  };

  const handleRunWorkflow = (workflowId) => {
    const report = runWorkflow({
      workflowId,
      roleId: selectedRole,
      actor: currentUser.email
    });
    setActiveReport(report);
    refreshActivityLog();
  };

  const handleSyncSources = () => {
    const isAllowed = canExecuteTool(selectedRole, 'sync_live_sources');
    const traceId = `TRACE-SYNC-${Math.floor(Date.now() / 1000)}`;

    logAiActivity({
      actor: currentUser.email,
      roleId: selectedRole,
      action: 'sync_live_sources',
      tool: 'sync_live_sources',
      outcome: isAllowed ? 'allowed' : 'denied',
      sources: isAllowed ? foundation.sources.filter((source) => source.isAccessible).map((source) => source.id) : [],
      traceId
    });

    setSyncState(isAllowed ? traceId : 'denied');
    setActiveReport(
      isAllowed
        ? {
            traceId,
            title: 'Live Source Synchronization',
            generatedAt: new Date().toISOString(),
            mcpTool: 'sync_live_sources',
            role: foundation.role.label,
            summary: 'MCP bridge refreshed accessible SQL, Jira, GRC, BankOS, custody, KRI, and regulatory-library metadata.',
            quality: {
              score: foundation.sourceCoverage,
              rating: 'source coverage refreshed',
              drivers: [
                `${foundation.sources.filter((source) => source.isAccessible).length} accessible source(s) refreshed`,
                'Superseded regulatory documentation remains archived and excluded from current authority',
                'Activity logged for future access review cycles'
              ]
            },
            evidence: [],
            metrics: [
              { label: 'Accessible sources', value: foundation.sources.filter((source) => source.isAccessible).length, tone: 'accent' },
              { label: 'Coverage', value: `${foundation.sourceCoverage}%`, tone: 'success' },
              { label: 'MCP endpoint', value: foundation.bridge.endpoint, tone: 'muted' },
              { label: 'Trace ID', value: traceId.slice(-10), tone: 'accent' }
            ],
            sections: []
          }
        : {
            accessDenied: true,
            traceId,
            title: 'Access denied',
            generatedAt: new Date().toISOString(),
            mcpTool: 'sync_live_sources',
            role: foundation.role.label,
            summary: `${foundation.role.label} cannot synchronize live sources. The MCP request was blocked before source access.`,
            quality: {
              score: 0,
              rating: 'blocked by RBAC',
              drivers: ['No source connector was queried because sync_live_sources is not granted to this role.']
            },
            evidence: []
          }
    );
    refreshActivityLog();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Regulatory Intelligence - VaultScope</title>
        <meta
          name="description"
          content="VaultScope MCP data foundation, regulatory intelligence, traceability, and governance workflows"
        />
      </Helmet>

      <SidebarNavigation />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
                <Icon name="Network" size={14} />
                VaultScope Data Foundation
              </div>
              <h1 className="mt-1 text-2xl font-bold text-foreground">Regulatory Intelligence</h1>
              <p className="text-sm text-muted-foreground">
                MCP-backed live data, SPK/MASAK regulatory checks, KRI detection, traceability, and governed AI activity.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        <main className="space-y-6 p-6">
          <section className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <h2 className="text-xl font-semibold text-foreground">Operational phase activation</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Analyses are generated from live-source metadata exposed through the VaultScope MCP bridge. Every output
                  is scored against source freshness, schema structure, active regulatory citations, and archived-document
                  handling.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge value="live">SQL/Jira/GRC live sync</StatusBadge>
                  <StatusBadge value="active">SPK III-35/B.1 primary</StatusBadge>
                  <StatusBadge value="active">MASAK AML/CTF primary</StatusBadge>
                  <StatusBadge value="archive-aware">archive-aware library</StatusBadge>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">Simulated query role</p>
                <Select value={selectedRole} onChange={setSelectedRole} options={roleOptions} className="mt-2" />
                <p className="mt-3 text-xs text-muted-foreground">{foundation.role.description}</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">MCP endpoint</p>
                <p className="mt-2 font-mono text-sm font-semibold text-foreground">{foundation.bridge.endpoint}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {foundation.bridge.serverName} / {foundation.bridge.transport} / {foundation.bridge.version}
                </p>
                <Button className="mt-4" size="sm" iconName="RefreshCcw" onClick={handleSyncSources}>
                  Sync live sources
                </Button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard metric={{ label: 'Source coverage', value: `${foundation.sourceCoverage}%`, tone: 'accent' }} />
            <MetricCard metric={{ label: 'Active obligations', value: foundation.activeRequirements.length, tone: 'success' }} />
            <MetricCard metric={{ label: 'KRI breaches', value: kriBreaches.length, tone: kriBreaches.length ? 'warning' : 'success' }} />
            <MetricCard metric={{ label: 'Archived docs', value: foundation.archivedRequirements.length, tone: 'muted' }} />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Fragmented data integration</h2>
                    <p className="text-sm text-muted-foreground">
                      MCP connectors unify audit findings, control status, BankOS, custody, KRI, and regulatory records in one context.
                    </p>
                  </div>
                  <Icon name="DatabaseZap" size={28} className="text-primary" />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {foundation.sources.map((source) => (
                    <div key={source.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{source.label}</h3>
                          <p className="text-xs text-muted-foreground">{source.system} via {source.adapter}</p>
                        </div>
                        <StatusBadge value={source.status}>{source.status}</StatusBadge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{source.description}</p>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">Last sync</p>
                          <p className="font-medium text-foreground">{formatDateTime(source.lastSyncedAt)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Schema</p>
                          <p className="font-medium text-foreground">{source.schemaVersion}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Records</p>
                          <p className="font-medium text-foreground">{source.records}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Access</p>
                          <p className={cn('font-medium', source.isAccessible ? 'text-success' : 'text-error')}>
                            {source.isAccessible ? 'granted' : 'blocked'}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">{source.governance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">MCP tool permissions</h2>
                <p className="text-sm text-muted-foreground">Tool calls are checked before any source connector is queried.</p>
                <div className="mt-4 space-y-3">
                  {availableTools.map((tool) => (
                    <div key={tool.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs font-semibold text-foreground">{tool.name}</p>
                        <StatusBadge value={tool.allowed ? 'allowed' : 'denied'}>{tool.allowed ? 'allowed' : 'denied'}</StatusBadge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">KRI detection system</h2>
                <div className="mt-4 space-y-3">
                  {foundation.kriSignals.map((signal) => (
                    <div key={signal.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{signal.indicator}</p>
                        <StatusBadge value={signal.value > signal.threshold ? signal.severity : 'effective'}>
                          {signal.value}/{signal.threshold}
                        </StatusBadge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {signal.id} linked to {signal.linkedProcess} · updated {formatDateTime(signal.updatedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Technical workflow activation</h2>
                <p className="text-sm text-muted-foreground">
                  Run governed MCP analyses for plan speed, cross-framework control status, and infrastructure-to-regulation gaps.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {workflowCards.map((workflow) => {
                const isAllowed = canExecuteTool(selectedRole, workflow.id);

                return (
                  <div key={workflow.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon name={workflow.icon} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{workflow.title}</h3>
                        <StatusBadge value={isAllowed ? 'allowed' : 'denied'}>{isAllowed ? 'authorized' : 'blocked'}</StatusBadge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{workflow.description}</p>
                    <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
                      {workflow.command}
                    </pre>
                    <Button className="mt-4" size="sm" iconName="Play" onClick={() => handleRunWorkflow(workflow.id)}>
                      Run analysis
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Structured analysis output</h2>
                    <p className="text-sm text-muted-foreground">
                      Output quality is tied to data freshness, schema versions, active citations, and source traceability.
                    </p>
                  </div>
                  {activeReport && <StatusBadge value={activeReport.accessDenied ? 'denied' : 'allowed'}>{activeReport.traceId}</StatusBadge>}
                </div>

                {!activeReport ? (
                  <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
                    <Icon name="FileSearch" size={42} className="mx-auto text-muted-foreground" />
                    <h3 className="mt-3 font-semibold text-foreground">No analysis selected</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Run a workflow to generate a traceable AI analysis package.</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <div className={cn('rounded-lg border p-4', activeReport.accessDenied ? toneClasses.error : toneClasses.accent)}>
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div>
                          <h3 className="font-semibold">{activeReport.title}</h3>
                          <p className="mt-1 text-sm opacity-90">{activeReport.summary}</p>
                        </div>
                        <div className="text-xs md:text-right">
                          <p>{activeReport.mcpTool}</p>
                          <p>{formatDateTime(activeReport.generatedAt)}</p>
                          <p>{activeReport.role}</p>
                        </div>
                      </div>
                    </div>

                    {activeReport.metrics && (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {activeReport.metrics.map((metric) => (
                          <MetricCard key={metric.label} metric={metric} />
                        ))}
                      </div>
                    )}

                    <div className="rounded-lg border border-border p-4">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <h3 className="font-semibold text-foreground">Quality score: {activeReport.quality.score}</h3>
                          <p className="text-sm text-muted-foreground">{activeReport.quality.rating}</p>
                        </div>
                        {!activeReport.accessDenied && (
                          <div className="grid grid-cols-3 gap-3 text-center text-xs">
                            <div className="rounded-md bg-muted p-2">
                              <p className="text-muted-foreground">Freshness</p>
                              <p className="font-semibold text-foreground">{activeReport.quality.freshnessScore}</p>
                            </div>
                            <div className="rounded-md bg-muted p-2">
                              <p className="text-muted-foreground">Schema</p>
                              <p className="font-semibold text-foreground">{activeReport.quality.schemaScore}</p>
                            </div>
                            <div className="rounded-md bg-muted p-2">
                              <p className="text-muted-foreground">Traceability</p>
                              <p className="font-semibold text-foreground">{activeReport.quality.traceabilityScore}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <ul className="mt-4 space-y-2">
                        {activeReport.quality.drivers.map((driver) => (
                          <li key={driver} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Icon name="CheckCircle2" size={15} className="mt-0.5 text-success" />
                            <span>{driver}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeReport.sections?.map((section) => (
                      <div key={section.heading} className="rounded-lg border border-border p-4">
                        <h3 className="font-semibold text-foreground">{section.heading}</h3>
                        <ul className="mt-3 space-y-2">
                          {section.items.map((item) => (
                            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                              <Icon name="ArrowRight" size={14} className="mt-0.5 text-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {activeReport.evidence?.length > 0 && (
                      <div className="rounded-lg border border-border p-4">
                        <h3 className="font-semibold text-foreground">Full traceability evidence</h3>
                        <div className="mt-3 max-h-72 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                                <th className="py-2 pr-3">Record</th>
                                <th className="py-2 pr-3">Source</th>
                                <th className="py-2 pr-3">Type</th>
                                <th className="py-2 pr-3">Updated</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeReport.evidence.map((item, index) => (
                                <tr key={`${item.recordId}-${index}`} className="border-b border-border last:border-0">
                                  <td className="py-2 pr-3 font-medium text-foreground">{item.recordId}</td>
                                  <td className="py-2 pr-3 text-muted-foreground">{item.source}</td>
                                  <td className="py-2 pr-3 text-muted-foreground">{item.type}</td>
                                  <td className="py-2 pr-3 text-muted-foreground">{formatDateTime(item.updatedAt)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Regulatory library</h2>
                <p className="text-sm text-muted-foreground">Active obligations drive analysis; superseded documents remain archived for history.</p>
                <div className="mt-4 space-y-3">
                  {foundation.regulatoryLibrary.map((requirement) => (
                    <div key={requirement.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{requirement.framework}</p>
                          <p className="text-xs text-muted-foreground">{requirement.article} · {requirement.sourceRecord}</p>
                        </div>
                        <StatusBadge value={requirement.status}>{requirement.status}</StatusBadge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{requirement.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Control map</h2>
                <div className="mt-4 space-y-3">
                  {foundation.controls.map((control) => (
                    <div key={control.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{control.name}</p>
                          <p className="text-xs text-muted-foreground">{control.domain} · {control.owner}</p>
                        </div>
                        <StatusBadge value={control.status}>{control.status.replace('_', ' ')}</StatusBadge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{control.frameworks.join(' / ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Governance and AI audit trail</h2>
                <p className="text-sm text-muted-foreground">
                  All AI-assisted query attempts are logged with role, tool, outcome, source scope, and trace ID.
                </p>
              </div>
              <Icon name="ShieldCheck" size={28} className="text-primary" />
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 pr-4">Time</th>
                    <th className="py-3 pr-4">Actor</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Tool</th>
                    <th className="py-3 pr-4">Outcome</th>
                    <th className="py-3 pr-4">Sources</th>
                    <th className="py-3 pr-4">Trace</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 text-muted-foreground">{formatDateTime(entry.timestamp)}</td>
                      <td className="py-3 pr-4 font-medium text-foreground">{entry.actor}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{entry.role}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-foreground">{entry.tool}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge value={entry.outcome}>{entry.outcome}</StatusBadge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{entry.sources.length ? entry.sources.join(', ') : '-'}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{entry.traceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RegulatoryIntelligence;
