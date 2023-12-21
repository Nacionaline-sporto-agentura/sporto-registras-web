import PasswordForm from '../components/forms/PasswordForm';
import { useVerifyUser } from '../utils/hooks';

const ResetPassword = () => {
  const { isLoading, data: invitation } = useVerifyUser();

  return (
    <PasswordForm
      isLoading={isLoading}
      title={'Nustatyti naują slaptažodį'}
      description={'Naujas slaptažodis neturi sutapti su senuoju slaptažodžiu'}
      successTitle={'Slaptažodis pakeistas'}
      successDescription={'Jūsų slaptažodis sėkmingai pakeistas. Galite prisijungti prie paskyros'}
      email={invitation?.user?.email}
    />
  );
};

export default ResetPassword;
