import 'server-only'
import { router } from "@/app/router"
import { headers } from 'next/headers'
import { createRouterClient } from '@orpc/server'

globalThis.$client = createRouterClient(router, {
  context: async () => {
    const headersList = await headers();
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const request = new Request(url, { headers: headersList });
    return { request };
  },
})
