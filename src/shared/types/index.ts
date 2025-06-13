// Shared type definitions for the GRC SaaS platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  COMPLIANCE_MANAGER = 'compliance_manager',
  RISK_MANAGER = 'risk_manager',
  AUDITOR = 'auditor',
  VENDOR_MANAGER = 'vendor_manager',
  USER = 'user'
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  riskToleranceLevel: 'low' | 'medium' | 'high';
  complianceFrameworks: string[];
  auditFrequency: number;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  slackIntegration?: {
    webhookUrl: string;
    channel: string;
  };
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  condition: string;
  action: string;
  recipients: string[];
  timeoutHours: number;
}

// Compliance Management Types
export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  requirements: ComplianceRequirement[];
  isActive: boolean;
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  mappedControls: string[];
}

export interface Control {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'preventive' | 'detective' | 'corrective';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  owner: string;
  status: ControlStatus;
  effectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'not_tested';
  lastTested?: Date;
  nextTestDue: Date;
  evidence: Evidence[];
  risks: string[];
  complianceRequirements: string[];
}

export enum ControlStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_REVIEW = 'under_review',
  NEEDS_UPDATE = 'needs_update'
}

export interface Evidence {
  id: string;
  controlId: string;
  type: 'document' | 'screenshot' | 'log' | 'report' | 'automated';
  name: string;
  description: string;
  filePath?: string;
  url?: string;
  collectedAt: Date;
  collectedBy: string;
  isAutomated: boolean;
  hyperSyncSource?: string;
}

// Risk Management Types
export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  status: RiskStatus;
  inherentRisk: RiskAssessment;
  residualRisk: RiskAssessment;
  tolerance: RiskTolerance;
  mitigationControls: string[];
  treatmentPlan?: TreatmentPlan;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  ACCEPTED = 'accepted',
  TRANSFERRED = 'transferred',
  AVOIDED = 'avoided'
}

export interface RiskAssessment {
  likelihood: number; // 1-5 scale
  impact: number; // 1-5 scale
  score: number; // calculated risk score
  rationale: string;
  assessedBy: string;
  assessedAt: Date;
}

export interface RiskTolerance {
  level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  threshold: number;
  justification: string;
}

export interface TreatmentPlan {
  strategy: 'mitigate' | 'accept' | 'transfer' | 'avoid';
  actions: TreatmentAction[];
  targetDate: Date;
  budget?: number;
  approvedBy: string;
}

export interface TreatmentAction {
  id: string;
  description: string;
  assignee: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
}

// Vendor Management Types
export interface Vendor {
  id: string;
  name: string;
  contactInfo: ContactInfo;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'under_review';
  contractInfo: ContractInfo;
  assessments: VendorAssessment[];
  documents: VendorDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
}

export interface ContractInfo {
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  value: number;
  currency: string;
  terms: string;
}

export interface VendorAssessment {
  id: string;
  vendorId: string;
  type: 'security' | 'privacy' | 'operational' | 'financial';
  questionnaire: SecurityQuestionnaire;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  completedAt: Date;
  completedBy: string;
  findings: AssessmentFinding[];
}

export interface SecurityQuestionnaire {
  id: string;
  name: string;
  version: string;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireQuestion {
  id: string;
  category: string;
  question: string;
  type: 'yes_no' | 'multiple_choice' | 'text' | 'file_upload';
  required: boolean;
  weight: number;
  options?: string[];
  answer?: any;
}

export interface AssessmentFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
  dueDate?: Date;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  type: 'contract' | 'soc2' | 'iso27001' | 'privacy_policy' | 'other';
  name: string;
  filePath: string;
  expiryDate?: Date;
  uploadedAt: Date;
  uploadedBy: string;
}

// Audit Management Types
export interface Audit {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'regulatory';
  framework: string;
  scope: string;
  status: AuditStatus;
  auditor: AuditorInfo;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  findings: AuditFinding[];
  evidence: Evidence[];
  reportPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AuditStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  EVIDENCE_REVIEW = 'evidence_review',
  DRAFT_REPORT = 'draft_report',
  FINAL_REPORT = 'final_report',
  COMPLETED = 'completed'
}

export interface AuditorInfo {
  name: string;
  firm: string;
  email: string;
  phone: string;
  credentials: string[];
}

export interface AuditFinding {
  id: string;
  auditId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  affectedControls: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'management_accepted';
  assignee: string;
  dueDate: Date;
  evidence: string[];
}

// Task Management Types
export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'compliance' | 'risk' | 'audit' | 'vendor' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
  assignee: string;
  reporter: string;
  dueDate: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  relatedEntityId?: string;
  relatedEntityType?: 'control' | 'risk' | 'vendor' | 'audit';
  externalTaskId?: string;
  externalSystem?: 'jira' | 'asana' | 'servicenow';
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled'
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: 'hypersync' | 'task_management' | 'notification';
  provider: string;
  config: IntegrationConfig;
  isActive: boolean;
  lastSync?: Date;
  createdAt: Date;
}

export interface IntegrationConfig {
  apiKey?: string;
  webhookUrl?: string;
  baseUrl?: string;
  credentials?: Record<string, any>;
  syncFrequency?: number;
  mappings?: Record<string, string>;
}

// Dashboard and Reporting Types
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  title: string;
  config: WidgetConfig;
  position: { x: number; y: number; width: number; height: number };
}

export interface WidgetConfig {
  dataSource: string;
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
  filters?: Record<string, any>;
  groupBy?: string;
  aggregation?: 'count' | 'sum' | 'avg' | 'min' | 'max';
  timeRange?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'compliance' | 'risk' | 'vendor' | 'audit' | 'custom';
  template: string;
  parameters: Record<string, any>;
  schedule?: ReportSchedule;
  recipients: string[];
  lastGenerated?: Date;
  createdAt: Date;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}