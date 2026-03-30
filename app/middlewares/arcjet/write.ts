import arcjet, {slidingWindow} from "@/app/middlewares/arcjet/arcjet"
import { base } from "@/app/middlewares/base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildStandardAj = () => 
    arcjet.withRule(
        slidingWindow({
            mode: "LIVE",
            interval: '1m',
            max: 40,
        })
    )


export const WriteSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,

    });

    if(decision.isDenied()) {
      if(decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Too many impactual changes. Please slow down.",
        });
      }

      if(decision.reason.isShield()) {
        throw errors.FORBIDDEN({
          message: "Reqest blocked by security policy (WAF).",
        });
      }

      throw errors.FORBIDDEN({
        message: "Request Blocked!",
      })
    }

    return next();
  }); 

