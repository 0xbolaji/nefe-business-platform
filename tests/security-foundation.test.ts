import {describe,expect,it} from "vitest";
import {can,canChangeRole,protectsFinalOwner} from "../app/lib/auth/permissions";
import {belongsToOrganization} from "../app/lib/auth/tenancy";
import {safeReturnTo} from "../app/lib/auth/safe-redirect";
describe("permission matrix",()=>{it("keeps audit and team administration restricted",()=>{expect(can("OWNER","audit.view")).toBe(true);expect(can("ADMINISTRATOR","team.manage")).toBe(true);expect(can("MANAGER","team.manage")).toBe(false);expect(can("VIEWER","pilot.create")).toBe(false)});it("protects Owner role boundaries",()=>{expect(canChangeRole("ADMINISTRATOR","OWNER","VIEWER",false)).toBe(false);expect(protectsFinalOwner(1,"OWNER","ADMINISTRATOR")).toBe(false);expect(protectsFinalOwner(2,"OWNER","ADMINISTRATOR")).toBe(true)})});
describe("tenancy guards",()=>{it("denies cross-organization records",()=>{expect(belongsToOrganization({organizationId:"org-a"},"org-a")).toBe(true);expect(belongsToOrganization({organizationId:"org-b"},"org-a")).toBe(false);expect(belongsToOrganization(undefined,"org-a")).toBe(false)})});
describe("redirect validation",()=>{it("allows only same-origin relative paths",()=>{expect(safeReturnTo("/workspace/pilots")).toBe("/workspace/pilots");expect(safeReturnTo("//evil.example")).toBe("/workspace/dashboard");expect(safeReturnTo("https://evil.example")).toBe("/workspace/dashboard")})});
