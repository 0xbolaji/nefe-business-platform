import {describe,expect,it} from "vitest";
import {analyzeEcosystem,scoreOpportunity} from "../app/(workspace)/_lib/commercial-intelligence";
import {businesses,campaigns,journeys,opportunities,partners} from "../app/(workspace)/_lib/mock-data";
import {pilots} from "../app/(workspace)/_lib/pilot-data";
import {calculatePilotReadiness,recommendPilotOutcome} from "../app/(workspace)/_lib/pilot-intelligence";
const data={businesses,campaigns,journeys,opportunities,partners};describe("deterministic engines",()=>{it("returns stable commercial intelligence",()=>{expect(scoreOpportunity(opportunities[0],data)).toEqual(scoreOpportunity(opportunities[0],data));expect(analyzeEcosystem(opportunities[0].businessIds,data)).toEqual(analyzeEcosystem(opportunities[0].businessIds,data))});it("returns stable pilot readiness and outcomes",()=>{expect(calculatePilotReadiness(pilots[0],data)).toEqual(calculatePilotReadiness(pilots[0],data));expect(recommendPilotOutcome(pilots[2],data)).toEqual({outcome:"Scale",reason:"Most KPI targets were achieved, milestones are complete and no open high-severity risk remains."})})});
