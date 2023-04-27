import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Divider, Stack, Tab, Tabs } from '@mui/material';
import { NextPageWithLayout } from 'src/types/next';
import { DashboardLayout } from 'src/components/templates/dashboard-layout';
import { useRouter } from 'next/router';
import { useProject } from 'src/hooks/projects/use-project';
import { Board } from 'src/components/organisms/kanban/board';
import { TitleInput } from 'src/components/atoms/title-input';
import { throttle } from 'lodash';
import { ProjectCollaboratorSelect } from 'src/components/molecules/project-collaborator-select';

const tabs = [
  { label: 'Board', value: 'board' },
  { label: 'List', value: 'list' },
  { label: 'Pages', value: 'pages' },
  { label: 'Settings', value: 'settings' },
];

const Page: NextPageWithLayout = () => {
  const r = useRouter();
  const projectId = r.query.id as string;
  const [ title, setTitle ] = useState('');
  const [ currentTab, setCurrentTab ] = useState<string>('board');
  const { project, updateName } = useProject({ projectId });
  const throttleUpdateName = useRef(throttle((projectId: string, name: string) => updateName({ projectId, name }), 1500, { leading: false })).current;

  useEffect(() => {
    if (project.data) {
      setTitle(project.data.title);
    }
  }, [ project.data?.title ]);

  const handleTabsChange = useCallback((_event: ChangeEvent<any>, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    throttleUpdateName(projectId, e.target.value);
  };

  if (project.isLoading || !project.data) return null;

  return (
    <Stack direction='column' flex={1} overflow='hidden'>
      <Stack sx={{ px: 3 }}>
        <Stack direction='row' justifyContent='space-between'>
          <TitleInput value={title} onChange={handleTitleChange} fullWidth />
          <ProjectCollaboratorSelect projectId={projectId} />
        </Stack>
        <Tabs
          indicatorColor='primary'
          onChange={handleTabsChange}
          scrollButtons='auto'
          textColor='primary'
          value={currentTab}
          variant='scrollable'
          sx={{ mt: 4 }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        <Divider />
      </Stack>
      {currentTab === 'board' && <Board projectId={projectId} arrangement='kanban' />}
      {currentTab === 'list' && <Board projectId={projectId} arrangement='list' />}
    </Stack>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
