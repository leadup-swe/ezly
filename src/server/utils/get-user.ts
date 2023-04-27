import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';

export const getUser = async (req: NextApiRequest) => {
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
