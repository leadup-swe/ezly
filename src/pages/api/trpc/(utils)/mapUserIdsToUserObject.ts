import clerkClient from "@clerk/clerk-sdk-node";
import { User } from "src/types/user";

export const mapUserIdsToUserObjects = async (
  orgId: string,
  userIds: string[]
): Promise<User[]> => {
  const orgMembers =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const users: User[] = [];

  userIds.forEach((id) => {
    const member = orgMembers.find(
      (member) => member.publicUserData?.userId === id
    );
    if (member) {
      users.push({
        id: member.publicUserData?.userId as string,
        firstname: member.publicUserData?.firstName,
        lastname: member.publicUserData?.lastName,
        avatar: member.publicUserData?.profileImageUrl,
        email: member.publicUserData?.identifier,
      });
    }
  });

  return users;
};
