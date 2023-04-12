import { useCallback, useState } from 'react';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { NewJobProcedureInput } from '@api/resolvers/jobs/new';
import { StackProps } from '@mui/system';

interface Props {
  onNext?: () => void
  onBack?: () => void
  register: UseFormRegister<NewJobProcedureInput>
  setValue: UseFormSetValue<NewJobProcedureInput>
}

export const JobDetailsStep = ({ onBack, onNext, register, setValue, ...other }: Props & StackProps) => {
  const [ tags, setTags ] = useState<string[]>([]);
  const [ dueDate, setDueDate ] = useState<Date | null>(null);

  const handleDueDateChange = useCallback((date: Date | null): void => {
    setDueDate(date);
    if (date) {
      setValue(`deadline`, date.toISOString());
    }
  }, []);

  const handleTagDelete = useCallback((tag: string): void => {
    setTags((prevState) => {
      return prevState.filter((t) => t !== tag);
    });
  }, []);

  return (
    <Stack spacing={3} {...other}>
      <Stack spacing={3}>
        <TextField fullWidth label='Job Title' placeholder='e.g Salesforce Analyst' {...register(`title`)} />
        <Stack alignItems='center' direction='row' flexWrap='wrap' spacing={1}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} onDelete={(): void => handleTagDelete(tag)} variant='outlined' />
          ))}
        </Stack>
      </Stack>
      <div>
        <Typography variant='h6'>{'When is the project due?'}</Typography>
      </div>
      <Stack alignItems='center' direction='row' spacing={3}>
        <MobileDatePicker
          label='Due date'
          inputFormat='dd/MM/yyyy'
          value={dueDate}
          onChange={handleDueDateChange}
          renderInput={(inputProps) => <TextField {...(inputProps as any)} />}
        />
      </Stack>
      <Stack alignItems='center' direction='row' spacing={2}>
        <Button endIcon={<ArrowRightIcon />} onClick={onNext} variant='contained'>
          {'Continue'}
        </Button>
        <Button color='inherit' onClick={onBack}>
          {'Back'}
        </Button>
      </Stack>
    </Stack>
  );
};
