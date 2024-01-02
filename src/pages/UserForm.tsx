import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import UserForm from '../components/forms/UserForm';
import { isNew } from '../utils/functions';
import { useIsTenantAdmin } from '../utils/hooks';
import { slugs } from '../utils/routes';

const cookies = new Cookies();

const profileId = cookies.get('profileId');

const UserFormPage = () => {
  const isTenantAdmin = useIsTenantAdmin();
  const { id = '' } = useParams();

  return (
    <UserForm
      canDelete={isTenantAdmin && !isNew(id)}
      canSubmit={isTenantAdmin}
      backUrl={slugs.users}
      tenantId={profileId}
    />
  );
};

export default UserFormPage;
