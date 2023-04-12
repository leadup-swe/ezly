import { Button, Stack, SvgIcon, TextField } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SignupFormValues } from '../[[...index]]';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';

interface Props {
  errors: FieldErrors<SignupFormValues>
  register: UseFormRegister<SignupFormValues>
  onNext: () => void
  onBack: () => void
}

export const Account = ({ errors, register, onNext, onBack }: Props) => {
  return (
    <Stack spacing={3}>
      <Stack spacing={3}>
        <TextField error={!!errors.name} fullWidth helperText={errors.name?.message} label='Your name' type='text' {...register('name')} />
        <TextField error={!!errors.email} fullWidth helperText={errors.email?.message} label='Email Address' type='email' {...register('email')} />
        <TextField error={!!errors.password} fullWidth helperText={errors.password?.message} label='Password' type='password' {...register('password')} />
        <TextField
          error={!!errors.passwordConfirm}
          fullWidth
          helperText={errors.passwordConfirm?.message}
          label='Password confirmation'
          type='password'
          {...register('passwordConfirm')}
        />
      </Stack>

      <Stack alignItems='center' direction='row' spacing={2}>
        <Button
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={onNext}
          variant='contained'
        >
          {'Continue'}
        </Button>
        <Button color='inherit' onClick={onBack}>
          {'Back'}
        </Button>
      </Stack>
    </Stack>
  );
};
