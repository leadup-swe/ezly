import { Button, Dialog, IconButton, SvgIcon, TextField, Typography } from '@mui/material';
import { Container, Stack } from '@mui/system';
import { ArrowLeft, PlusSquare } from '@untitled-ui/icons-react';
import { defaultPadding } from 'src/constants/default-padding';
import { useDisclosure } from 'src/hooks/use-disclosure';
import { QuillEditor } from '../quill-editor';
import { useForm } from 'react-hook-form';
import { CreateProjectInput } from 'src/server/routers/projects/create-project';
import { useOrganization } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { api } from 'src/api';

type FormData = Pick<CreateProjectInput, `description` | `title`>;

export const NewProjectModal = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const { organization } = useOrganization();
  const { register, setValue, handleSubmit } = useForm<FormData>();
  const { mutate: createProject, isLoading } = api.projects.projectCreate.useMutation();
  const apiCtx = api.useClient();

  const onSubmit = handleSubmit(async ({ title, description }: FormData) => {
    if (!organization) return;
    createProject({ input: { title, description } }, { onSuccess: handleOnSuccess });
  });

  const handleOnSuccess = () => {
    onClose();
    apiCtx.invalidateQueries(api.projects.projectsEnrolled.getKey());
    toast.success(`Project created successfully`);
  };

  return (
    <>
      <IconButton size='small' onClick={onOpen}>
        <SvgIcon fontSize='small'>
          <PlusSquare />
        </SvgIcon>
      </IconButton>
      <Dialog open={open} fullScreen>
        <Stack direction='row' p={defaultPadding}>
          <IconButton size='small' onClick={onClose}>
            <SvgIcon fontSize='small'>
              <ArrowLeft />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Stack flex={1} justifyContent='center'>
          <Container maxWidth='sm'>
            <Typography variant='h3'>{'Create a new project'}</Typography>
            <Typography variant='h6' mt='48px' fontWeight={400}>
              {'How would you like to name this project?'}
            </Typography>
            <TextField fullWidth label='Project name' sx={{ mt: `24px` }} {...register(`title`)} />
            <Typography variant='h6' mt='48px' fontWeight={400}>
              {'Would you like to create a short description of this project?'}
            </Typography>
            <QuillEditor sx={{ mt: `24px`, height: 400 }} onChange={(t) => setValue(`description`, t)} />
            <Button sx={{ mt: `24px` }} variant='contained' onClick={onSubmit}>
              {'Create project'}
            </Button>
          </Container>
        </Stack>
      </Dialog>
    </>
  );
};
