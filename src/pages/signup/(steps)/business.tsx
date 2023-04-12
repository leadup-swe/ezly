import { Button, Stack, SvgIcon, TextField } from '@mui/material';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { SignupFormValues } from '../[[...index]]';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import CountrySelect from '@molecules/country-select/country-select';

interface Props {
  errors: FieldErrors<SignupFormValues>
  register: UseFormRegister<SignupFormValues>
  control: Control<any>
  onNext: () => void
}

export const BusinessStep = ({ errors, register, control, onNext }: Props) => {
  return (
    <Stack spacing={3}>
      <Stack spacing={3}>
        <TextField
          error={!!errors.businessName}
          fullWidth
          helperText={errors.businessName?.message}
          label='Business name'
          type='text'
          {...register('businessName')}
        />
        <TextField error={!!errors.address} fullWidth helperText={errors.address?.message} label='Address' type='text' {...register('address')} />
        <TextField error={!!errors.city} fullWidth helperText={errors.city?.message} label='City' type='text' {...register('city')} />
        <CountrySelect control={control} name='country' />
        <TextField error={!!errors.taxId} fullWidth helperText={errors.taxId?.message} label='Tax ID (optional)' type='text' {...register('taxId')} />
      </Stack>

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
    </Stack>
  );
};
