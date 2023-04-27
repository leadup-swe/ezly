import { BlockNoteView } from '@blocknote/react';
import { Dialog, Stack, Theme, useMediaQuery, Box, IconButton, SvgIcon, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { defaultPadding } from 'src/constants/default-padding';
import { useProject } from 'src/hooks/projects/use-project';
import { AssigneeSelect } from 'src/components/molecules/assignee-select';
import { GetTaskOutput } from 'src/server/routers/projects/get-task';
import { useEditor } from '../editor';
import { useCallback, useRef, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { XClose } from '@untitled-ui/icons-react';
import { TitleInput } from 'src/components/atoms/title-input';
import { SubtaskAdd } from '../kanban/subtask-add';
import '@blocknote/core/style.css';

type Props = {
  open: boolean
  onClose: () => void
  task: GetTaskOutput
};

export const TaskModal = ({ open, onClose, task }: Props) => {
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const r = useRouter();
  const projectId = r.query.id as string;
  const [ mountTime ] = useState(Date.now());
  const { updateTask, collaborators, assignTask, unassignTask } = useProject({ projectId });
  const titleInput = useRef<HTMLInputElement>(null);
  const debouncedUpdateTitle = useRef(_.debounce((newTitle: string) => updateTask({ taskId: task.id, title: newTitle }), 1200, { leading: false })).current;
  const { editor } = useEditor({
    initialBlocks: task.description ? JSON.parse(task.description) : undefined,
    onChange: (b) => updateTask({ taskId: task.id, description: JSON.stringify(b) }),
    debounced: true,
    delay: 1200,
  });

  const updateTitle = useCallback(() => {
    if (titleInput?.current && moment().isAfter(moment(mountTime).add(1200, `ms`))) {
      debouncedUpdateTitle(titleInput.current.value);
    }
  }, []);

  const handleAssigneeChange = useCallback(
    (id: string) => {
      if (task?.assignees.find((a) => a.id === id)) {
        unassignTask({ taskId: task.id, userId: id });
      } else {
        assignTask({ taskId: task?.id as string, userId: id });
      }
    },
    [ task.id ],
  );

  return (
    <Dialog maxWidth='lg' open={open} onClose={onClose} disableEnforceFocus fullWidth fullScreen={!smUp} scroll='body'>
      {!smUp && (
        <Stack direction='row' justifyContent='flex-end'>
          <Box>
            <IconButton size='large' onClick={onClose}>
              <SvgIcon>
                <XClose />
              </SvgIcon>
            </IconButton>
          </Box>
        </Stack>
      )}
      <Box px={defaultPadding}>
        <Stack direction={smUp ? `row` : `column`}>
          <Stack flex={1} justifyContent='flex-start' order={smUp ? 1 : 2} sx={{ minHeight: `50vh`, maxWidth: `900px`, p: defaultPadding }}>
            <TitleInput placeholder='Title' defaultValue={task.title} fullWidth onChange={updateTitle} inputRef={titleInput} />
            <Box mt={2}>
              <BlockNoteView editor={editor} />
            </Box>
            <Stack mt={3}>
              <Typography variant='subtitle1' mb={1}>
                {'Sub-tasks'}
              </Typography>
              <SubtaskAdd />
            </Stack>
            <Stack mt={3}>
              <Typography variant='subtitle1'>{'Comments'}</Typography>
            </Stack>
          </Stack>
          <Stack
            direction='column'
            sx={(theme: Theme) => ({ borderLeft: 1, borderColor: theme.palette.divider })}
            order={smUp ? 2 : 1}
            pl={smUp ? defaultPadding : 0}
            maxWidth='300px'
            width='100%'
          >
            {smUp && (
              <Stack direction='row' justifyContent='flex-end' mt={1} mr={-2}>
                <Box>
                  <IconButton size='large' onClick={onClose}>
                    <SvgIcon>
                      <XClose />
                    </SvgIcon>
                  </IconButton>
                </Box>
              </Stack>
            )}
            <AssigneeSelect
              projectId={projectId}
              options={collaborators}
              label='Select assignees'
              onChange={handleAssigneeChange}
              value={task.assignees ? task.assignees.map((a) => a.id) : []}
            />
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};
