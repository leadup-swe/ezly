import { AuthLayout } from '@templates/auth-layout';
import { NextPageWithLayout } from '@/types/next';
import { SignUp } from '@clerk/nextjs';

const Page: NextPageWithLayout = () => {
  return <SignUp path='/signup' routing='path' signInUrl='/login' afterSignUpUrl='/onboarding' />;
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
