import { AuthLayout } from '@templates/auth-layout';
import * as Yup from 'yup';
import { NextPageWithLayout } from '@/types/next';
import { SignIn } from '@clerk/nextjs';

interface FormValues {
  email: string
  password: string
  submit: null
}

const validationSchema = Yup.object({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page: NextPageWithLayout = () => {
  return <SignIn path='/login' routing='path' signUpUrl='/signup' afterSignInUrl='/dashboard' />;
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
export default Page;
