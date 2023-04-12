import ChevronLeftIcon from '@untitled-ui/icons-react/build/esm/ChevronLeft';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import { Box, Button, Container, IconButton, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { NextPageWithLayout } from '@/types/next';
import { CompanyCard } from '@molecules/company-card';
import { JobListSearch } from '@organisms/job-list-search';
import { paths } from '../../../paths';
import Link from 'next/link';
import { DashboardLayout } from '@templates/dashboard-layout';
import { Company } from '@devias-kit-pro/next/src/types/job';
import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';

const now = new Date();
1;
const companies: Company[] = [
  {
    id: 'GR-2FR43',
    averageRating: 4.5,
    employees: '50-100',
    isVerified: true,
    jobs: [
      {
        id: '560a3dfd48c1602f4ff5d6ac',
        currency: '$',
        isRemote: true,
        publishedAt: subMinutes(now, 24).getTime(),
        salaryMax: '75k',
        salaryMin: '55k',
        title: 'Remote React / React Native Developer',
      },
      {
        id: '6681e0dbfab15e83498b0d10',
        city: 'Munich',
        country: 'Germany',
        currency: '$',
        publishedAt: subHours(now, 2).getTime(),
        salaryMax: '160k',
        salaryMin: '80k',
        title: 'Senior Golang Backend Engineer',
      },
    ],
    logo: '/assets/companies/company-logo-1.svg',
    name: 'Augmastic Inc.',
    shortDescription: 'Building technologies and ideas that move us as the leaders in Augmented Reality',
  },
  {
    id: 'FR-58F46',
    averageRating: 4.3,
    employees: '50-100',
    isVerified: false,
    jobs: [
      {
        id: '52cf72df2a519538d3d8a18d',
        currency: '$',
        isRemote: true,
        publishedAt: subHours(now, 1).getTime(),
        salaryMax: '160k',
        salaryMin: '80k',
        title: 'Remote React / React Native Developer',
      },
    ],
    logo: '/assets/companies/company-logo-2.svg',
    name: 'Cryptomania SRL',
    shortDescription: 'Monitor and optimize your content for long-term audience loyalty',
  },
  {
    id: 'FR-2X70G',
    averageRating: 4.5,
    employees: '50-100',
    isVerified: false,
    jobs: [
      {
        id: '5f59ed345f6527d6dbb81339',
        currency: '$',
        isRemote: true,
        publishedAt: subDays(subHours(subMinutes(subSeconds(now, 52), 39), 7), 5).getTime(),
        salaryMax: '210k',
        salaryMin: '150k',
        title: 'Senior Backend Engineer',
      },
    ],
    logo: '/assets/companies/company-logo-3.svg',
    name: 'Talkster Inc.',
    shortDescription: 'Discover innovative companies and the people behind them',
  },
  {
    id: 'RO-1K6WE',
    averageRating: 4.9,
    employees: '1-10',
    isVerified: true,
    jobs: [
      {
        id: '96b71438ad92a9c729111680',
        currency: '$',
        isRemote: true,
        publishedAt: subDays(subHours(subMinutes(subSeconds(now, 41), 89), 45), 8).getTime(),
        salaryMax: '160k',
        salaryMin: '80k',
        title: 'Mid Frontend Developer',
      },
    ],
    logo: '/assets/companies/company-logo-4.svg',
    name: 'Devias IO SRL',
    shortDescription: 'Impact-ready developer tools and templates',
  },
];

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='lg'>
          <Grid
            alignItems='center'
            container
            sx={{
              backgroundColor: 'neutral.900',
              borderRadius: 1,
              color: 'common.white',
              px: 4,
              py: 8,
            }}
          >
            <Grid xs={12} sm={7}>
              <Typography color='inherit' variant='h3'>
                {'Reach 50k+ potential candidates.'}
              </Typography>
              <Typography color='neutral.500' sx={{ mt: 2 }} variant='body1'>
                {'Post your job today for free. Promotions start at $99.'}
              </Typography>
              <Button color='primary' component={Link} href={paths.dashboard.jobs.new} size='large' sx={{ mt: 3 }} variant='contained'>
                {'Post a job'}
              </Button>
            </Grid>
            <Grid
              sm={5}
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
                justifyContent: 'center',
              }}
            >
              <img src='/assets/iconly/iconly-glass-shield.svg' />
            </Grid>
          </Grid>
          <Stack spacing={4} sx={{ mt: 4 }}>
            <JobListSearch />
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
            <Stack
              alignItems='center'
              direction='row'
              justifyContent='flex-end'
              spacing={2}
              sx={{
                px: 3,
                py: 2,
              }}
            >
              <IconButton disabled>
                <SvgIcon fontSize='small'>
                  <ChevronLeftIcon />
                </SvgIcon>
              </IconButton>
              <IconButton>
                <SvgIcon fontSize='small'>
                  <ChevronRightIcon />
                </SvgIcon>
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
