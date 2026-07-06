import type { Metadata } from "next";
import PricingPage from "./pricing";

export const metadata:Metadata={title:"Merchant Pricing | NEFE",description:"Simple commercial plans for businesses joining the NEFE network."};
export default function Page(){return <PricingPage/>}

