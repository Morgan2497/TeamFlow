import z from "zod";
import { standardSecuritymiddleware } from "../middlewares/arcjet/standard";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { WriteSecurityMiddleware } from "../middlewares/arcjet/write";
import prisma from "@/lib/db";
import { createMessageSchema } from "../schemas/message";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/lib/generated/prisma";

export const createMessage = base.
use(requiredAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.use(standardSecuritymiddleware)
.use(WriteSecurityMiddleware)
.route({
  method: "POST",
  path: "/message",
  summary: "Create a new message",
  tags: ["messages"],
})
.input(createMessageSchema)
.output(z.custom<Message>())
.handler(async ({input, context, errors}) => {

    // verify the channel belongs to the user's organization

    const channel = await prisma.channel.findFirst({
        where: {
            id: input.channelId,
            workspaceId: context.workspace.orgCode,

        },
    });

    if(!channel) {
        throw errors.FORBIDDEN();
    }

    const created = await prisma.message.create({
        data: {
            content: input.content,
            imageUrl: input.imageUrl,
            channelId: channel.id,
            authorId: context.user.id,
            authorEmail: context.user.email ?? '',
            authorName: context.user.given_name ?? 'Morgan',
            authorAvatar: getAvatar(context.user.picture, context.user.email!),
        }
    })
    return {
        ...created,
    }
});

export const listMessages = base
.use(requiredAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.use(standardSecuritymiddleware)
.route({
  method: "GET",
  path: "/messages",
  summary: "List all messages",
  tags: ["messages"],
})
.input(z.object({
  channelId: z.string(),
}))
.output(z.array(z.custom<Message>()))
.handler(async ({input , context, errors}) => {
    const channel = await prisma.channel.findFirst({
        where: {
            id: input.channelId,
            workspaceId: context.workspace.orgCode,
        },
    });
    if(!channel) {
        throw errors.FORBIDDEN();
    }
    const messages = await prisma.message.findMany({
        where: {
            channelId: channel.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return messages;
});