import { Container, Typography } from '@mui/material';
import { DashboardLayout } from '@templates/dashboard-layout';
import { NextPageWithLayout } from '@/types/next';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Page: NextPageWithLayout = () => {
  const { organization, isLoaded } = useOrganization();
  const { organizationList, setActive } = useOrganizationList();
  const r = useRouter();

  useEffect(() => {
    if (isLoaded && !organization) {
      if (organizationList?.length) {
        setActive({ organization: organizationList[0].organization });
        return;
      }
      r.push('/dashboard/onboarding');
    }
  }, [ organizationList, organization, isLoaded ]);

  return (
    <Container>
      <Typography>{"We're in baby"}</Typography>
    </Container>
  );
};

Page.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;
