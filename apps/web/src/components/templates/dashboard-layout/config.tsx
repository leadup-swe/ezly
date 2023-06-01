import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@mui/material';
import HomeSmileIcon from '@atoms/icons/untitled-ui/duocolor/home-smile';
import { paths } from '../../../paths';
import MessageChatSquareIcon from '@atoms/icons/untitled-ui/duocolor/message-chat-square';
import { NewProjectModal } from 'src/components/organisms/new-project-modal';
import { useOrganization } from '@clerk/nextjs';
import { api } from 'src/api';

export const SIDE_NAV_WIDTH = 300;

export interface Item {
  disabled?: boolean
  external?: boolean
  icon?: ReactNode
  items?: Item[]
  label?: ReactNode
  path?: string
  title: string
}

export interface Section {
  items: Item[]
  subheader?: string
  sectionComponent?: ReactNode
}

export const useSections = (): Section[] => {
  const { organization } = useOrganization();
  const { t } = useTranslation();

  const { data: { projectsEnrolled } = {} } = api.projects.projectsEnrolled.useQuery(undefined, { enabled: !!organization });

  return useMemo(
    () => [
      {
        subheader: `Dashboard`,
        items: [
          {
            title: `Home`,
            path: paths.dashboard.home,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: `Messages`,
            path: paths.dashboard.chat,
            icon: (
              <SvgIcon fontSize='small'>
                <MessageChatSquareIcon />
              </SvgIcon>
            ),
          },
        ],
      },
      {
        subheader: `Job board`,
        items: [
          {
            title: `New`,
            path: paths.dashboard.jobs.new,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: `Active jobs`,
            path: paths.dashboard.jobs.active,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: `All`,
            path: paths.dashboard.jobs.all,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
        ],
      },
      {
        subheader: `Projects`,
        sectionComponent: <NewProjectModal />,
        items:
          projectsEnrolled?.map((proj) => ({
            title: proj.title,
            path: `${paths.dashboard.projects.index}/${proj.id}`,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          })) || [],
      },
      {
        subheader: `Social`,
        items: [
          {
            title: `Profile`,
            path: paths.dashboard.social.profile,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: `Reviews`,
            path: paths.dashboard.social.reviews,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: `Insights`,
            path: paths.dashboard.social.insights,
            icon: (
              <SvgIcon fontSize='small'>
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
        ],
      },
    ],
    [ t, projectsEnrolled ],
  );
};
