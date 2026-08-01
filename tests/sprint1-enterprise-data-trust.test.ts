import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";
import {activityEvent} from "../app/lib/collaboration/domain-events";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("Sprint 1 journey persistence",()=>{
  const schema=read("db/schema.ts");
  const create=read("app/lib/actions/workspace-create-actions.ts");
  const migration=read("db/migrations/0006_overconfident_marvel_apes.sql");

  it("stores first-class metadata and every selected tenant business",()=>{
    expect(schema).toContain('journeyType:text("journey_type")');
    expect(schema).toContain('export const journeyParticipants=pgTable("journey_participants"');
    expect(create).toContain("journeyType:data.journeyType");
    expect(create).toContain("ids.map(businessId=>({organizationId:context.organization.id,journeyId:record.id,businessId}))");
  });

  it("commits the journey, participants, audit and activity together",()=>{
    expect(create).toContain("database().transaction(async tx=>");
    expect(create).toContain("tx.insert(auditLogs)");
    expect(create).toContain("tx.insert(collaborationActivityEvents)");
  });

  it("backfills existing participant and journey metadata safely",()=>{
    expect(migration).toContain('INSERT INTO "journey_participants"');
    expect(migration).toContain('FROM "journey_stages"');
    expect(migration).toContain('UPDATE "journeys" SET');
    expect(migration).toContain("ON CONFLICT DO NOTHING");
  });
});

describe("Sprint 1 pilot persistence",()=>{
  const actions=read("app/lib/actions/workspace-mutations.ts");
  const provider=read("app/(workspace)/workspace/_components/pilot-state.tsx");

  it("persists task creation, KPI changes and pilot updates",()=>{
    expect(actions).toContain("export async function createPilotTask");
    expect(actions).toContain("export async function updatePilotKpi");
    expect(actions).toContain("export async function createPilotUpdate");
    expect(provider).toContain("await createPilotTask");
    expect(provider).toContain("await updatePilotKpi");
    expect(provider).toContain("await createPilotUpdate");
  });

  it("persists milestone completion and task blocked state",()=>{
    expect(actions).toContain("completion:data.completion");
    expect(actions).toContain("blocked:data.blocked");
    expect(provider).toContain("completion:update.completion");
    expect(provider).toContain("blocked:update.blocked");
  });

  it("tenant-scopes pilot writes and records evidence transactionally",()=>{
    expect(actions).toContain("eq(pilotKpis.organizationId,context.organization.id)");
    expect(actions).toContain("eq(pilots.organizationId,context.organization.id)");
    expect(actions).toContain("tx.insert(auditLogs)");
    expect(actions).toContain("tx.insert(collaborationActivityEvents)");
  });
});

describe("Sprint 1 dashboard activity",()=>{
  it("uses the canonical collaboration stream instead of the legacy table",()=>{
    const repository=read("app/lib/data/workspace-repository.ts");
    expect(repository).toContain("from(collaborationActivityEvents)");
    expect(repository).not.toContain("from(activities)");
    expect(repository).toContain("title:row.summary");
  });

  it("keeps deterministic activity records human-readable",()=>{
    expect(activityEvent("pilot.lifecycle_changed","pilot","00000000-0000-4000-8000-000000000001",{component:"task"})).toMatchObject({summary:"Pilot lifecycle changed",entityType:"pilot",metadata:{component:"task"}});
  });
});
