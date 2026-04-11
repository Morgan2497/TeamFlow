import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
                "CATEGORY:MONITOR",
                "CATEGORY:WEBHOOK",
            ],
        }),
    ],
});

async function existingMiddleware(req: NextRequest) {
    const { getClaim } = getKindeServerSession();
    const orgCode = await getClaim("org_code");
    const orgValue = orgCode?.value;

    const url = req.nextUrl;

    if (
        orgValue &&
        url.pathname.startsWith("/workspace") &&
        !url.pathname.startsWith(`/workspace/${orgValue}`)
    ) {
        url.pathname = `/workspace/${orgValue}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export default createMiddleware(aj, existingMiddleware);

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|rpc).*)"],
};
