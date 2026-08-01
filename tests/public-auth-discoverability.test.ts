import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("public authentication discoverability",()=>{
  it("routes shared desktop and mobile account actions to the existing authentication pages",()=>{
    const navigation=read("app/components/site-navbar.tsx");
    expect(navigation.match(/href="\/sign-in"/g)).toHaveLength(2);
    expect(navigation.match(/href="\/sign-up"/g)).toHaveLength(2);
    expect(navigation.match(/href="\/onboarding"/g)).toHaveLength(2);
  });

  it("separates homepage account creation from business onboarding",()=>{
    const homepage=read("app/page.tsx");
    expect(homepage).toContain('href="/sign-up" className="button-primary">Get Started');
    expect(homepage.match(/href="\/onboarding"/g)).toHaveLength(2);
    expect(homepage.match(/Apply as a business/g)).toHaveLength(2);
  });

  it("links the onboarding wizard to sign-in and registration without changing its steps",()=>{
    const onboarding=read("app/onboarding/onboarding-wizard.tsx");
    expect(onboarding).toContain('href="/sign-in"');
    expect(onboarding).toContain('href="/sign-up"');
    expect(onboarding).toContain("Step {step} of 5");
    expect(onboarding).toContain("setStep(4)");
  });
});
