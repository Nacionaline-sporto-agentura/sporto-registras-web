import { useParams } from 'react-router-dom';
import UserForm from '../components/forms/UserForm';
import { isNew } from '../utils/functions';
import { useIsTenantUser } from '../utils/hooks';
import { slugs } from '../utils/routes';

const OrganizationUser = () => {
  const { tenantId = '', id = '' } = useParams();
  const isUser = useIsTenantUser();

  return (
    <UserForm
      canSubmit={!isUser}
      canDelete={!isUser && !isNew(id)}
      backUrl={slugs.organizationUsers(tenantId)}
      tenantId={tenantId}
    />
  );
};

export default OrganizationUser;
