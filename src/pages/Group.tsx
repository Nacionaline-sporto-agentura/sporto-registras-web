import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import BackButton from '../components/buttons/BackButton';
import GroupGroups from '../components/containers/GroupGroups';
import GroupUser from '../components/containers/GroupUser';

import Breadcrumbs, { BreadcrumbsProps } from '../components/other/BreadCrumbs';
import EditIcon from '../components/other/EditIcon';
import FullscreenLoader from '../components/other/FullscreenLoader';
import GroupDeleteComponent from '../components/other/GroupDeleteComponent';
import SimpleContainer from '../components/other/SimpleContainer';
import {
  StyledTabBar,
  ViewContainer,
  ViewInnerRow,
  ViewRow,
  ViewTitle,
} from '../styles/CommonStyles';
import Api from '../utils/api';
import { handleGenerateBreadcrumbsPath } from '../utils/functions';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

export interface GroupProps {
  name: string;
}

export const getTabs = (id: string) => [
  {
    label: 'Nariai',
    slug: slugs.groupUsers(id),
  },
  {
    label: 'Grupės',
    slug: slugs.groupGroups(id),
  },
];

const GroupPage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const { isLoading, data: group } = useQuery(['group', id], () => Api.getGroup({ id }), {
    onError: () => {
      navigate(slugs.groups);
    },
  });

  const { data: breadCrumbs = [] } = useQuery(
    ['breadCrumbs', id],
    async () => handleGenerateBreadcrumbsPath({ item: await Api.getGroupParent({ id }) }),
    {
      onError: () => {
        navigate(slugs.groups);
      },
      enabled: !!id,
    },
  );

  const breadCrumbsInfo: BreadcrumbsProps = {
    items: breadCrumbs,
    homeName: pageTitles.groups,
    homeRoute: slugs.groups,
    pathRoute: slugs.groupUsers,
  };

  const tabs = getTabs(id);

  const currentTab = useGetCurrentRoute(tabs);

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const containers = {
    [slugs.groupUsers(id)]: <GroupUser />,
    [slugs.groupGroups(id)]: <GroupGroups groups={group?.children || []} />,
  };

  return (
    <ViewContainer>
      <BackButton />
      <Breadcrumbs
        items={breadCrumbsInfo?.items}
        homeName={breadCrumbsInfo?.homeName}
        homeRoute={breadCrumbsInfo?.homeRoute}
        pathRoute={(id) => breadCrumbsInfo.pathRoute(id)}
      />
      <ViewRow>
        <ViewInnerRow>
          <ViewTitle>{group?.name || '-'}</ViewTitle>
          <EditIcon onClick={() => navigate(slugs.editGroup(id))} />
        </ViewInnerRow>
        <GroupDeleteComponent group={group} />
      </ViewRow>
      <SimpleContainer>
        <StyledTabBar tabs={tabs} />
        {currentTab && containers[currentTab?.slug as any]}
      </SimpleContainer>
    </ViewContainer>
  );
};

export default GroupPage;
