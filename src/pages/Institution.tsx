import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

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

export const getTabs = (id: string) => [
  {
    label: 'Nariai',
    slug: slugs.institutionUsers(id),
  },
];

const cookies = new Cookies();

const profileId = cookies.get('profileId');

const InstitutionPage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const { isLoading, data: group } = useQuery(['institution', id], () => Api.getTenant({ id }), {
    onError: () => {
      navigate(slugs.groups);
    },
    onSuccess: (data) => {
      if (profileId && data.id === profileId) {
        navigate(slugs.myOrganization);
      }
    },
  });

  const tabs = getTabs(id);

  const currentTab = useGetCurrentRoute(tabs);

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const containers = {
    [slugs.institutionUsers(id)]: (
      <OrganizationUsers onClickRow={(userId) => navigate(slugs.institutionUser(id, userId))} />
    ),
  };

  return (
    <ViewContainer>
      <BackButton />

      <ViewRow>
        <ViewInnerRow>
          <ViewTitle>{group?.name || '-'}</ViewTitle>
          <EditIcon onClick={() => navigate(slugs.updateInstitution(id))} />
        </ViewInnerRow>
      </ViewRow>
      <SimpleContainer>
        <StyledTabBar tabs={tabs} />
        {currentTab && containers[currentTab?.slug as any]}
      </SimpleContainer>
    </ViewContainer>
  );
};

export default InstitutionPage;
