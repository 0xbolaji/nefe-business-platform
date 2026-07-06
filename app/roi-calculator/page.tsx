import type { Metadata } from "next";
import RoiCalculator from "./roi-calculator";

export const metadata: Metadata = {
  title: "ROI Calculator | NEFE",
  description: "Estimate the commercial value of joining the NEFE business ecosystem.",
};

export default function RoiCalculatorPage() {
  return <RoiCalculator />;
}
