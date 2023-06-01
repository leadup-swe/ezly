import { Injectable } from '@nestjs/common';
import clerk from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  getClient(): typeof clerk {
    return clerk;
  }

  async getOrganizationMembershipList(userId: string) {
    return clerk.users.getOrganizationMembershipList({ userId });
  }

  async userBelongToOrgCheck(userId: string, organizationId: string) {
    const organizations = await this.getOrganizationMembershipList(userId);
    return organizations.some((org) => org.organization.id === organizationId);
  }
}
