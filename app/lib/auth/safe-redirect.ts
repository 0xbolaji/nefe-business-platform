export function safeReturnTo(value:string|undefined,fallback="/workspace/dashboard"){if(!value||!value.startsWith("/")||value.startsWith("//")||value.includes("\\"))return fallback;return value}
