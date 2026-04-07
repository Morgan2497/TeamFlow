import z from "zod";
import { heavyWriteMiddleware } from "../middlewares/arcjet/heavy-write";
import { standardSecuritymiddleware } from "../middlewares/arcjet/standard";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { channelNameSchema } from "../schemas/channel";
import prisma from "@/lib/db";
import { init, Organizations } from "@kinde/management-api-js";
import type { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs/types";

const channelOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workspaceId: z.string(),
  createdById: z.string(),
});

const workspaceMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string().nullable().optional(),
});

export const createChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecuritymiddleware)
  .use(heavyWriteMiddleware)
  .route({
    method: "POST",
    path: "/channel",
    summary: "Create a new Channel",
    tags: ["channels"],
  })
  .input(channelNameSchema)
  .output(channelOutputSchema)
  .handler(async ({ input, context, errors }) => {
    const workspaceId = context.workspace.orgCode;
    if (!workspaceId) {
      throw errors.FORBIDDEN({ message: "No workspace context" });
    }

    try {
      const channel = await prisma.channel.create({
        data: {
          name: input.name,
          workspaceId,
          createdById: context.user.id,
        },
      });
      return channel;
    } catch {
      throw errors.FORBIDDEN({ message: "Could not create channel" });
    }
  });

export type ChannelSchemaNameType = z.output<typeof channelNameSchema>;

function mapOrganizationUserToMember(u: unknown): z.infer<
  typeof workspaceMemberSchema
> {
  const r = u as Record<string, unknown>;
  const given = String(r.given_name ?? "");
  const family = String(r.family_name ?? "");
  const fullFromParts = `${given} ${family}`.trim();
  const name =
    (r.name != null && String(r.name).length > 0
      ? String(r.name)
      : fullFromParts) || "Member";
  const rawPicture = r.picture ?? r.picture_url ?? r.profile_picture;
  const picture =
    rawPicture != null && String(rawPicture).length > 0
      ? String(rawPicture)
      : null;

  return {
    id: String(r.id ?? ""),
    name,
    email: String(r.email ?? ""),
    picture,
  };
}

type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;

/** Kinde org-user API is heavily rate-limited; cache + dedupe concurrent calls. */
const ORG_MEMBERS_TTL_MS = 5 * 60 * 1000;
const orgMembersCache = new Map<
  string,
  { members: WorkspaceMember[]; expiresAt: number }
>();
const orgMembersInFlight = new Map<string, Promise<WorkspaceMember[]>>();

async function getOrganizationMembersForWorkspace(
  orgCode: string
): Promise<WorkspaceMember[]> {
  const now = Date.now();
  const cached = orgMembersCache.get(orgCode);
  if (cached && cached.expiresAt > now) {
    return cached.members;
  }

  const inFlight = orgMembersInFlight.get(orgCode);
  if (inFlight) {
    return inFlight;
  }

  const promise = (async () => {
    try {
      const domain = process.env.KINDE_DOMAIN;
      const clientId = process.env.KINDE_MANAGEMENT_CLIENT_ID;
      const clientSecret = process.env.KINDE_MANAGEMENT_CLIENT_SECRET;
      if (!domain || !clientId || !clientSecret) {
        return [];
      }
      init({
        kindeDomain: domain,
        clientId,
        clientSecret,
      });
      const usersInOrg = await Organizations.getOrganizationUsers({
        orgCode,
        sort: "name_asc",
      });
      const raw = usersInOrg.organization_users ?? [];
      const members = raw.map(mapOrganizationUserToMember);
      orgMembersCache.set(orgCode, {
        members,
        expiresAt: now + ORG_MEMBERS_TTL_MS,
      });
      return members;
    } catch {
      if (cached) {
        return cached.members;
      }
      return [];
    } finally {
      orgMembersInFlight.delete(orgCode);
    }
  })();

  orgMembersInFlight.set(orgCode, promise);
  return promise;
}

export const listChannels = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/channels",
    summary: "List all channels",
    tags: ["channels"],
  })
  .input(z.void())
  .output(
    z.object({
      channels: z.array(channelOutputSchema),
      members: z.array(workspaceMemberSchema),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    })
  )
  .handler(async ({ context, errors }) => {
    const workspaceId = context.workspace.orgCode;
    if (!workspaceId) {
      throw errors.FORBIDDEN({ message: "No workspace context" });
    }

    const domain = process.env.KINDE_DOMAIN;
    const clientId = process.env.KINDE_MANAGEMENT_CLIENT_ID;
    const clientSecret = process.env.KINDE_MANAGEMENT_CLIENT_SECRET;

    if (!domain || !clientId || !clientSecret) {
      throw errors.INTERNAL_SERVER_ERROR();
    }

    const [channels, members] = await Promise.all([
      prisma.channel.findMany({
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      getOrganizationMembersForWorkspace(workspaceId),
    ]);

    return {
      channels,
      members,
      currentWorkspace: context.workspace,
    };
  });
