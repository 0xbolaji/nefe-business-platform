"use client";

import Link from "next/link";
import { useState } from "react";

export function PilotDecisionActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-13 items-center justify-center rounded-xl bg-white px-6 text-[10px] font-semibold text-[#4F30C9] shadow-xl transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(209,168,73,.18)]"
        >
          Approve Pilot Direction
        </button>
        <Link href="/opportunity-engine" className="inline-flex h-13 items-center justify-center rounded-xl border border-white/15 bg-white/[.06] px-6 text-[10px] font-semibold text-white transition hover:-translate-y-1">
          Open Opportunity Engine
        </Link>
        <Link href="/pilot-plan" className="inline-flex h-13 items-center justify-center rounded-xl border border-[#D1AA50]/30 bg-[#D1AA50]/10 px-6 text-[10px] font-semibold text-[#E4C675] transition hover:-translate-y-1">
          View Pilot Plan
        </Link>
        <Link href="/platform" className="inline-flex h-13 items-center justify-center rounded-xl border border-white/15 bg-white/[.04] px-6 text-[10px] font-semibold text-white transition hover:-translate-y-1">
          Explore Full Prototype
        </Link>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#07050D]/72 px-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="pilot-decision-title">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[30px] border border-white/12 bg-[#120C1D] p-6 text-left text-white shadow-[0_32px_90px_rgba(0,0,0,.42)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5E3BEE] via-[#D1A849] to-[#7D5BFF]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[.06] text-white/70 transition hover:bg-white/12 hover:text-white"
              aria-label="Close pilot approval confirmation"
            >
              ×
            </button>
            <p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#D9B95F]">Executive confirmation</p>
            <h3 id="pilot-decision-title" className="mt-4 text-3xl font-semibold tracking-[-.04em]">
              Pilot direction ready for approval.
            </h3>
            <p className="mt-4 text-[12px] leading-6 text-white/72">
              The recommended next step is to authorize a controlled 90-day UAE pilot, select the first partner cluster, and assign an executive owner.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Scope", "10–20 curated UAE businesses"],
                ["Decision", "Approve pilot direction"],
                ["Owner", "Assign accountable pilot lead"],
                ["Output", "Revenue data and scale-up plan"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[16px] border border-white/10 bg-white/[.055] p-4">
                  <p className="text-[7px] font-bold uppercase tracking-[.14em] text-white/45">{label}</p>
                  <p className="mt-2 text-[11px] font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/pilot-plan" className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-white text-[10px] font-bold text-[#4F30C9] transition hover:-translate-y-0.5">
                Open Pilot Plan
              </Link>
              <Link href="/opportunity-engine" className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-[#D1AA50]/30 bg-[#D1AA50]/10 text-[10px] font-bold text-[#E4C675] transition hover:-translate-y-0.5">
                Build Pilot Cluster
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
