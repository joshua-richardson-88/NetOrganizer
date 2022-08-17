import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from './context'

const id = z.string().cuid()
const title = z.string().max(256, 'Max title length is 256')
const url = z.string().url()
const description = z.string()

const QueryAllSchema = z.object({ gID: id })
const CreateLinkSchema = z.object({ gID: id, title, url, description })
const UpdateInputSchema = z.object({
  id,
  title: title.optional(),
  url: url.optional(),
  notes: description.optional(),
})
const DeleteInputSchema = z.object({ id })

export type QueryAllInput = z.TypeOf<typeof QueryAllSchema>
export type CreateLinkInput = z.TypeOf<typeof CreateLinkSchema>
export type UpdateLinkTitle = z.TypeOf<typeof UpdateInputSchema>
export type DeleteLinkInput = z.TypeOf<typeof DeleteInputSchema>
export const linksRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.passage.user.id.length < 2 && ctx.req?.cookies['psg_auth_token']) {
      try {
        const authToken = ctx.req.cookies['psg_auth_token']

        if (authToken == null) throw new Error('no cookie found')

        const verified = await ctx.passage.validAuthToken(authToken)

        if (verified == null) throw new Error('could not verify userToken')

        return next({
          ctx: {
            ...ctx,
            user: verified,
          },
        })
      } catch (error) {
        console.log('middleware 1 error')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            "User not currently logged in, they don't have access to this api",
        })
      }
    }
    return next()
  })
  .middleware(async ({ ctx, next }) => {
    // see if the passage user exists in our db
    const dbHasUser = await ctx.prisma.user.findFirst({
      where: { passageId: ctx.user },
    })
    // if the user doesn't exist yet, make them
    if (dbHasUser == null) {
      const dbUser = await ctx.prisma.user.create({
        data: { passageId: ctx.user },
      })
      if (dbUser == null)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'could not create new user',
        })

      // update the context
      return next({
        ctx: {
          ...ctx,
          user: dbUser.id,
        },
      })
    }
    // the user does exist, update the context
    return next({
      ctx: {
        ...ctx,
        user: dbHasUser.id,
      },
    })
  })
  .mutation('addNew', {
    input: CreateLinkSchema,
    resolve({ ctx, input }) {
      return ctx.prisma.link.create({
        data: {
          title: input.title,
          url: input.url,
          notes: input.description,
          group: {
            connect: {
              id: input.gID,
            },
          },
        },
      })
    },
  })
  .mutation('update', {
    input: UpdateInputSchema,
    async resolve({ ctx, input }) {
      const hasId = await ctx.prisma.link.findUnique({
        where: { id: input.id },
      })
      if (hasId == null) throw new TRPCError({ code: 'NOT_FOUND' })

      const data: { title?: string; url?: string; notes?: string } = {}

      if (input.title != null) data.title = input.title
      if (input.url != null) data.url = input.url
      if (input.notes != null) data.notes = input.notes

      const updated = await ctx.prisma.link.update({
        data,
        where: { id: input.id },
      })
      return updated
    },
  })
  .mutation('delete', {
    input: DeleteInputSchema,
    resolve({ ctx, input }) {
      return ctx.prisma.link.delete({
        where: { id: input.id },
      })
    },
  })
  .query('getAll', {
    input: QueryAllSchema,
    resolve({ ctx: { prisma }, input }) {
      return prisma.link.findMany({
        where: { groupId: input.gID },
        select: { title: true, id: true, url: true, notes: true },
      })
    },
  })
