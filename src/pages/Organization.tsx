import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import BackButton from '../components/buttons/BackButton';
import OrganizationUsers from '../components/containers/OrganizationUsers';

import EditIcon from '../components/other/EditIcon';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import {
  StyledTabBar,
  ViewContainer,
  ViewInnerRow,
  ViewRow,
  ViewTitle,
} from '../styles/CommonStyles';
import Api from '../utils/api';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';

export interface GroupProps {
  name: string;
}

export const getTabs = (id: string) => [
  {
    label: 'Nariai',
    slug: slugs.organizationUsers(id),
  },
];

const OrganizationPage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const { isLoading, data: group } = useQuery(['organization', id], () => Api.getTenant({ id }), {
    onError: () => {
      navigate(slugs.groups);
    },
  });

  const tabs = getTabs(id);

  const currentTab = useGetCurrentRoute(tabs);

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const containers = {
    [slugs.organizationUsers(id)]: <OrganizationUsers />,
  };

  return (
    <ViewContainer>
      <BackButton />

      <ViewRow>
        <ViewInnerRow>
          <ViewTitle>{group?.name || '-'}</ViewTitle>
          <EditIcon onClick={() => {}} />
        </ViewInnerRow>
      </ViewRow>
      <SimpleContainer>
        <StyledTabBar tabs={tabs} />
        {currentTab && containers[currentTab?.slug]}
      </SimpleContainer>
    </ViewContainer>
  );
};

export default OrganizationPage;
