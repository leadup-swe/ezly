import { useOrganization } from '@clerk/nextjs';
import { OrganizationMembership } from '@clerk/nextjs/api';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const OrganizationCtx = createContext<{
  members: OrganizationMembership[] | null
}>({ members: null });

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

  return <OrganizationCtx.Provider value={{ members }}>{children}</OrganizationCtx.Provider>;
};
