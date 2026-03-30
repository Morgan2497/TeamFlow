import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { KindeUser, KindeOrganization } from '@kinde-oss/kinde-auth-nextjs/types';
import { base } from '@/app/middlewares/base';
import { z } from "zod";
import { requiredAuthMiddleware } from '../middlewares/auth';
import { requiredWorkspaceMiddleware } from '@/app/middlewares/workspace';
import { workspaceSchema } from '../schemas/workspace';
import { init, Organizations } from '@kinde/management-api-js'
import { standardSecuritymiddleware } from '../middlewares/arcjet/standard';
import { heavyWriteMiddleware } from '../middlewares/arcjet/heavy-write';

export const listWorkspaces = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecuritymiddleware)
  .use(heavyWriteMiddleware)
  .route({
    method: 'GET',
    path: '/workspace',
    summary: 'list all workspaces',
    tags: ["workspace"],
  })
  .input(z.void())
  .output(z.object({
    workspaces: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string(),
      })
    ),
    user: z.custom<KindeUser<Record<string, unknown>>>(),
    currentWorkspace: z.custom<KindeOrganization<unknown>>(),
  }))
  .handler(async ({ input, context, errors }) => {
    const { getUserOrganizations } = getKindeServerSession()
    const organizations = await getUserOrganizations();

    if (!organizations) {
      throw errors.FORBIDDEN()
    }
    return {
      workspaces: organizations?.orgs.map((org) => ({
        id: org.code,
        name: org.name ?? 'My workspace',
        avatar: org.name?.charAt(0) ?? "M",
      })),
      user: context.user,
      currentWorkspace: context.workspace,
    }
  })

export const createWorkspaces = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecuritymiddleware)
  .use(heavyWriteMiddleware)
  .route({
    method: 'POST',
    path: '/workspace',
    summary: 'Create a new workspace',
    tags: ["workspace"],
  })
  .input(workspaceSchema)
  .output(
    z.object({
      orgCode: z.string(),
      workspaceName: z.string(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const domain = process.env.KINDE_DOMAIN;
    const clientId = process.env.KINDE_MANAGEMENT_CLIENT_ID;
    const clientSecret = process.env.KINDE_MANAGEMENT_CLIENT_SECRET;

    if (!domain || !clientId || !clientSecret) {
      throw errors.INTERNAL_SERVER_ERROR();
    }

    init({
      kindeDomain: domain,
      clientId,
      clientSecret,
    });

    let data;
    try {
      data = await Organizations.createOrganization({
        requestBody: {
          name: input.name,
        },
      })
    } catch {
      throw errors.FORBIDDEN();
    }

    const orgCode = data.organization?.code;
    if (!orgCode) {
      throw errors.FORBIDDEN();
    }

    try {
      await Organizations.addOrganizationUsers({
        orgCode,
        requestBody: {
          users: [{
            id: context.user.id,
            roles: ["admin"],
          }]
        }
      });
    } catch {
      throw errors.FORBIDDEN();
    }

    const { refreshTokens } = getKindeServerSession();
    await refreshTokens();

    return {
      orgCode,
      workspaceName: input.name,
    }
  })
