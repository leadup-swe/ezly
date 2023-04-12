import { CreateNextContextOptions } from '@trpc/server/dist/adapters/next';
import { inferAsyncReturnType } from '@trpc/server';
import { prisma } from './prisma';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';

const getUser = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return {
      user: null,
      organizations: null,
    };
  }

  const [ user, organizations ] = await Promise.all([ clerkClient.users.getUser(userId), clerkClient.users.getOrganizationMembershipList({ userId }) ]);
  return { user, organizations };
};

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const { user, organizations } = await getUser(req);

  return {
    req,
    res,
    prisma,
    user,
    organizations,
  };
};

export type TCtx = inferAsyncReturnType<typeof createContext>;
