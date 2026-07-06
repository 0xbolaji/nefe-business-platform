import type { Metadata } from "next";
import FinancialModel from "./financial-model";

export const metadata:Metadata={title:"Financial Model | NEFE",description:"Board-level projections, unit economics and growth scenarios for NEFE."};
export default function Page(){return <FinancialModel/>}

