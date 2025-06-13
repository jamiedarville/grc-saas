import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Organizations table
  await knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.string('domain').unique();
    table.json('settings').defaultTo('{}');
    table.timestamps(true, true);
  });

  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.enum('role', ['admin', 'compliance_manager', 'risk_manager', 'auditor', 'vendor_manager', 'user']).defaultTo('user');
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('lastLogin').nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['organizationId']);
  });

  // Compliance frameworks table
  await knex.schema.createTable('compliance_frameworks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.string('version').notNullable();
    table.text('description').nullable();
    table.boolean('isActive').defaultTo(true);
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
  });

  // Compliance requirements table
  await knex.schema.createTable('compliance_requirements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('frameworkId').references('id').inTable('compliance_frameworks').onDelete('CASCADE');
    table.string('code').notNullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('category').nullable();
    table.enum('priority', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.timestamps(true, true);
    
    table.index(['frameworkId']);
    table.index(['code']);
  });

  // Controls table
  await knex.schema.createTable('controls', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('category').nullable();
    table.enum('type', ['preventive', 'detective', 'corrective']).notNullable();
    table.enum('frequency', ['continuous', 'daily', 'weekly', 'monthly', 'quarterly', 'annually']).notNullable();
    table.uuid('owner').references('id').inTable('users').nullable();
    table.enum('status', ['active', 'inactive', 'under_review', 'needs_update']).defaultTo('active');
    table.enum('effectiveness', ['effective', 'partially_effective', 'ineffective', 'not_tested']).defaultTo('not_tested');
    table.timestamp('lastTested').nullable();
    table.timestamp('nextTestDue').notNullable();
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
    table.index(['owner']);
    table.index(['status']);
  });

  // Control-requirement mappings
  await knex.schema.createTable('control_requirements', (table) => {
    table.uuid('controlId').references('id').inTable('controls').onDelete('CASCADE');
    table.uuid('requirementId').references('id').inTable('compliance_requirements').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.primary(['controlId', 'requirementId']);
  });

  // Risks table
  await knex.schema.createTable('risks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('category').nullable();
    table.uuid('owner').references('id').inTable('users').nullable();
    table.enum('status', ['identified', 'assessed', 'mitigated', 'accepted', 'transferred', 'avoided']).defaultTo('identified');
    table.integer('inherentLikelihood').checkBetween([1, 5]);
    table.integer('inherentImpact').checkBetween([1, 5]);
    table.integer('residualLikelihood').checkBetween([1, 5]).nullable();
    table.integer('residualImpact').checkBetween([1, 5]).nullable();
    table.enum('tolerance', ['very_low', 'low', 'medium', 'high', 'very_high']).defaultTo('medium');
    table.timestamp('reviewDate').notNullable();
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
    table.index(['owner']);
    table.index(['status']);
  });

  // Risk-control mappings
  await knex.schema.createTable('risk_controls', (table) => {
    table.uuid('riskId').references('id').inTable('risks').onDelete('CASCADE');
    table.uuid('controlId').references('id').inTable('controls').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.primary(['riskId', 'controlId']);
  });

  // Vendors table
  await knex.schema.createTable('vendors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.string('primaryContact').nullable();
    table.string('email').nullable();
    table.string('phone').nullable();
    table.text('address').nullable();
    table.string('website').nullable();
    table.string('category').nullable();
    table.enum('riskLevel', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.enum('status', ['active', 'inactive', 'under_review']).defaultTo('active');
    table.string('contractNumber').nullable();
    table.date('contractStartDate').nullable();
    table.date('contractEndDate').nullable();
    table.date('renewalDate').nullable();
    table.decimal('contractValue', 15, 2).nullable();
    table.string('currency', 3).defaultTo('USD');
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
    table.index(['riskLevel']);
    table.index(['status']);
  });

  // Audits table
  await knex.schema.createTable('audits', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.enum('type', ['internal', 'external', 'regulatory']).notNullable();
    table.string('framework').nullable();
    table.text('scope').nullable();
    table.enum('status', ['planned', 'in_progress', 'evidence_review', 'draft_report', 'final_report', 'completed']).defaultTo('planned');
    table.string('auditorName').nullable();
    table.string('auditorFirm').nullable();
    table.string('auditorEmail').nullable();
    table.date('plannedStartDate').notNullable();
    table.date('plannedEndDate').notNullable();
    table.date('actualStartDate').nullable();
    table.date('actualEndDate').nullable();
    table.string('reportPath').nullable();
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
    table.index(['status']);
    table.index(['type']);
  });

  // Tasks table
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title').notNullable();
    table.text('description').nullable();
    table.enum('type', ['compliance', 'risk', 'audit', 'vendor', 'general']).defaultTo('general');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.enum('status', ['todo', 'in_progress', 'review', 'done', 'blocked', 'cancelled']).defaultTo('todo');
    table.uuid('assignee').references('id').inTable('users').nullable();
    table.uuid('reporter').references('id').inTable('users').notNullable();
    table.timestamp('dueDate').notNullable();
    table.integer('estimatedHours').nullable();
    table.integer('actualHours').nullable();
    table.json('tags').defaultTo('[]');
    table.uuid('relatedEntityId').nullable();
    table.string('relatedEntityType').nullable();
    table.string('externalTaskId').nullable();
    table.enum('externalSystem', ['jira', 'asana', 'servicenow']).nullable();
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
    table.index(['assignee']);
    table.index(['status']);
    table.index(['priority']);
  });

  // Evidence table
  await knex.schema.createTable('evidence', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('controlId').references('id').inTable('controls').onDelete('CASCADE');
    table.enum('type', ['document', 'screenshot', 'log', 'report', 'automated']).notNullable();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('filePath').nullable();
    table.string('url').nullable();
    table.timestamp('collectedAt').notNullable();
    table.uuid('collectedBy').references('id').inTable('users').notNullable();
    table.boolean('isAutomated').defaultTo(false);
    table.string('hyperSyncSource').nullable();
    table.timestamps(true, true);
    
    table.index(['controlId']);
    table.index(['collectedBy']);
    table.index(['isAutomated']);
  });

  // Integrations table
  await knex.schema.createTable('integrations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.enum('type', ['hypersync', 'task_management', 'notification']).notNullable();
    table.string('provider').notNullable();
    table.json('config').defaultTo('{}');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('lastSync').nullable();
    table.uuid('organizationId').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['organizationId']);
    table.index(['type']);
    table.index(['isActive']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('integrations');
  await knex.schema.dropTableIfExists('evidence');
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('audits');
  await knex.schema.dropTableIfExists('vendors');
  await knex.schema.dropTableIfExists('risk_controls');
  await knex.schema.dropTableIfExists('risks');
  await knex.schema.dropTableIfExists('control_requirements');
  await knex.schema.dropTableIfExists('controls');
  await knex.schema.dropTableIfExists('compliance_requirements');
  await knex.schema.dropTableIfExists('compliance_frameworks');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('organizations');
}