export const STANDARD_SESSION_SECONDS=60*60*8;
export const REMEMBERED_SESSION_SECONDS=60*60*24*30;
export function describeClient(userAgent:string){const browser=/Edg\//.test(userAgent)?"Edge":/CriOS|Chrome\//.test(userAgent)?"Chrome":/FxiOS|Firefox\//.test(userAgent)?"Firefox":/Safari\//.test(userAgent)?"Safari":"Unknown browser";const platform=/iPhone|iPad/.test(userAgent)?"iOS":/Android/.test(userAgent)?"Android":/Windows/.test(userAgent)?"Windows":/Macintosh/.test(userAgent)?"macOS":"Unknown platform";return {browser,platform}}
