import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MerchantProfile from "./merchant-profile";
import { compatibleMerchants, merchantBySlug, merchants, merchantSlug } from "../merchant-data";

export function generateStaticParams() {
  return merchants.map(merchant => ({ slug: merchantSlug(merchant.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const merchant = merchantBySlug(slug);
  if (!merchant) return { title: "Merchant Not Found | NEFE" };
  return {
    title: `${merchant.name} | NEFE Merchant Intelligence`,
    description: `Partnership intelligence, compatible businesses and revenue projections for ${merchant.name}.`,
  };
}

export default async function MerchantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const merchant = merchantBySlug(slug);
  if (!merchant) notFound();
  return <MerchantProfile merchant={merchant} matches={compatibleMerchants(merchant)} />;
}

