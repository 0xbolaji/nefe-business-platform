import BrandLogo from "./components/brand-logo";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F8F7FA]">
      <div className="text-center">
        <div className="brand-loading mx-auto w-fit">
          <BrandLogo size="lg" priority />
        </div>
        <div className="mx-auto mt-6 h-1 w-36 overflow-hidden rounded-full bg-[#EAE5EE]">
          <div className="experience-progress h-full rounded-full bg-gradient-to-r from-[#5E3BEE] to-[#CBA044]" />
        </div>
        <p className="mt-3 text-[8px] font-bold uppercase tracking-[.16em] text-[#938C99]">
          Preparing your workspace
        </p>
      </div>
    </main>
  );
}
