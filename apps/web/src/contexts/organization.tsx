import { useOrganization } from '@clerk/nextjs';
import { OrganizationMembership } from '@clerk/nextjs/api';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from 'src/types/user';

export const OrganizationCtx = createContext<{
  members: OrganizationMembership[] | null
  getUsersFromIds: (ids: string[]) => User[]
}>({ members: null, getUsersFromIds: () => [] });

export const OrganizationCtxProvider = ({ children }: { children: ReactNode }) => {
  const [ members, setMembers ] = useState<OrganizationMembership[] | null>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    if (!organization) return;
    if (!members) {
      organization.getMemberships().then((members) => {
        setMembers(members as any);
      });
    }
  }, [ organization ]);

  const getUsersFromIds = (ids: string[]): User[] => {
    const users = ids.map((id) => {
      const membership = members?.find((m) => m.publicUserData?.userId === id);

      if (!membership) return null;

      const user: User = {
        id: membership?.publicUserData?.userId as string,
        firstname: membership?.publicUserData?.firstName as string,
        lastname: membership?.publicUserData?.lastName as string,
        avatar: membership?.publicUserData?.profileImageUrl as string,
        email: membership?.publicUserData?.identifier as string,
      };

      return user;
    });

    return users.filter((u) => u !== null) as User[];
  };

  return <OrganizationCtx.Provider value={{ members, getUsersFromIds }}>{children}</OrganizationCtx.Provider>;
};
