import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Button, Card, Radio, Stack, SvgIcon, Typography } from '@mui/material';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SignupFormValues } from '../[[...index]]';
import { useState } from 'react';

interface CategoryOption {
  title: string
  description: string
  value: string
}

const categoryOptions: CategoryOption[] = [
  {
    title: 'Hire services or products',
    description: `We're looking for services or products to buy`,
    value: 'client',
  },
  {
    title: 'Offer services or products',
    description: 'We offer services or products related to design, development, advertising etc.',
    value: 'supplier',
  },
];

interface Props {
  onNext: () => void
  onBack: () => void
  setValue: UseFormSetValue<SignupFormValues>
  watch: UseFormWatch<SignupFormValues>
}

export const Category = ({ onBack, onNext, setValue, watch, ...other }: Props) => {
  const [ category, setCategory ] = useState<string | undefined>(watch().category);
  const handleCategoryChange = (category: string): void => {
    setCategory(category);
    setValue('category', category);
  };

  return (
    <Stack spacing={3} {...other}>
      <div>
        <Typography variant='h6'>{`We're looking to...`}</Typography>
      </div>
      <Stack spacing={2}>
        {categoryOptions.map((option) => (
          <Card
            key={option.value}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              p: 2,
              ...(category === option.value && {
                backgroundColor: 'primary.alpha12',
                boxShadow: (theme) => `${theme.palette.primary.main} 0 0 0 1px`,
              }),
            }}
            onClick={() => handleCategoryChange(option.value)}
            variant='outlined'
          >
            <Stack direction='row' spacing={2}>
              <Radio checked={category === option.value} color='primary' size='medium' />
              <div>
                <Typography variant='subtitle1'>{option.title}</Typography>
                <Typography color='text.secondary' variant='body2'>
                  {option.description}
                </Typography>
              </div>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Stack alignItems='center' direction='row' spacing={2}>
        <Button
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={onNext}
          disabled={!category}
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
