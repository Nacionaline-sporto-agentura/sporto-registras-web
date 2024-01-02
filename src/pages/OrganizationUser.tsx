import { useParams } from 'react-router-dom';
import UserForm from '../components/forms/UserForm';
import { isNew } from '../utils/functions';
import { slugs } from '../utils/routes';

const OrganizationUser = () => {
  const { tenantId = '', id = '' } = useParams();

  return (
    <UserForm
      canSubmit={true}
      canDelete={!isNew(id)}
      backUrl={slugs.organizationUsers(tenantId)}
      tenantId={tenantId}
    />
  );
};

export default OrganizationUser;
