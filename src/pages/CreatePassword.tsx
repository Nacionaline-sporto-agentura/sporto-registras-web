import PasswordForm from '../components/forms/PasswordForm';
import { useVerifyUser } from '../utils/hooks';

const CreatePassword = () => {
  const { isLoading, data: invitation } = useVerifyUser();

  return (
    <PasswordForm
      isLoading={isLoading}
      title={'Nustatyti naują slaptažodį'}
      description={`Jus pakvietė ${invitation?.inviter?.name}`}
      successTitle={'Slaptažodis sukurtas'}
      successDescription={'Jūsų slaptažodis sėkmingai sukurtas. Galite prisijungti prie paskyros'}
      email={invitation?.user?.email}
    />
  );
};

export default CreatePassword;
