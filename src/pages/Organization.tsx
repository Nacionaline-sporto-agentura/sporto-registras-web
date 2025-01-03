import { useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

import OrganizationExtendedForm from '../components/forms/OrganizationExtendedForm';

import Api from '../utils/api';
import { handleErrorToastFromServer } from '../utils/functions';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

export const getTabs = (id: string) => [
  {
    label: 'Nariai',
    slug: slugs.organizationUsers(id),
  },
];

const cookies = new Cookies();

const profileId = cookies.get('profileId');

const OrganizationPage = () => {
  const title = pageTitles.organization;
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showRequest } = Object.fromEntries([...Array.from(searchParams)]);

  const { isFetching, data: organization } = useQuery(
    ['organization', id, showRequest],
    () => (!!showRequest ? Api.getRequestTenantBase({ id }) : Api.getRequestTenant({ id })),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      onSuccess: (data) => {
        if (profileId && data.id === profileId) {
          navigate(slugs.myOrganization);
        }
      },
      refetchOnWindowFocus: false,
    },
  );

  return (
    <OrganizationExtendedForm
      back={true}
      title={title}
      disabled={true}
      organization={organization}
      isLoading={isFetching}
      id={id}
    />
  );
};

export default OrganizationPage;
