import { NextPageWithLayout } from '@/types/next';
import { useOrganizationList } from '@clerk/nextjs';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface FormValues {
  name: string
  description: string
  website?: string
}

const Page: NextPageWithLayout = () => {
  const { createOrganization } = useOrganizationList();
  const { handleSubmit, register } = useForm<FormValues>();
  const r = useRouter();

  const submitForm = async (data: FormValues) => {
    const result = await createOrganization?.({ name: data.name });

    if (result?.id) {
      console.log(result.id);
      r.push(`/dashboard`);
    }
  };

  return (
    <Stack direction='column' maxWidth='200px' spacing={2}>
      <Typography>{'Onboarding screen'}</Typography>
      <TextField label='Organization name' placeholder='Organization name' {...register(`name`)} />
      <TextField label='Description' placeholder='Description' {...register(`description`)} />
      <TextField label='Website' placeholder='https://...' {...register(`website`)} />

      <Button variant='contained' onClick={handleSubmit(submitForm)}>
        {'Create organization'}
      </Button>
    </Stack>
  );
};

export default Page;
