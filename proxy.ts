// Next.js 16 Proxy always runs on Node.js; the production build records `/_middleware` as `runtime: "nodejs"`.
// Route-segment runtime exports are intentionally not allowed in proxy files by the installed framework.
export {auth as proxy} from "@/auth";
export const config={matcher:["/workspace/:path*"]};
