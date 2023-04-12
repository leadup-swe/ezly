import { useCallback, useState } from 'react';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Button, Stack, SvgIcon } from '@mui/material';
import { QuillEditor } from '@organisms/quill-editor';
import { UseFormSetValue } from 'react-hook-form';
import { NewJobProcedureInput } from '@api/resolvers/jobs/new';

interface Props {
  onBack?: () => void
  setValue: UseFormSetValue<NewJobProcedureInput>
  onSubmit: () => void
}

export const JobDescriptionStep = ({ onBack, setValue, onSubmit, ...other }: Props) => {
  const [ content, setContent ] = useState('');

  const handleContentChange = useCallback((value: string): void => {
    setContent(value);
    setValue(`description`, value);
  }, []);

  return (
    <Stack spacing={3} {...other}>
      <QuillEditor onChange={handleContentChange} placeholder='Write something' sx={{ height: 400 }} value={content} />
      <Stack alignItems='center' direction='row' spacing={2}>
        <Button
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={onSubmit}
          variant='contained'
        >
          {'Create Job'}
        </Button>
        <Button color='inherit' onClick={onBack}>
          {'Back'}
        </Button>
      </Stack>
    </Stack>
  );
};
