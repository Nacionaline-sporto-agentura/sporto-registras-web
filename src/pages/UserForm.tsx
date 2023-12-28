import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../components/fields/TextField';
import FormPageWrapper from '../components/layouts/FormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import GroupsContainer from '../components/other/GroupContainer';
import SimpleContainer from '../components/other/SimpleContainer';
import { useAppSelector } from '../state/hooks';
import { Column, FormRow } from '../styles/CommonStyles';
import { DeleteInfoProps, ReactQueryError, User } from '../types';
import Api from '../utils/api';
import {
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  isCurrentUser,
  isNew,
} from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../utils/texts';

export const validateCreateUserForm = Yup.object().shape({
  firstName: Yup.string()
    .required(validationTexts.requireText)
    .test('validFirstName', validationTexts.validFirstName, (values) => {
      if (/\d/.test(values || '')) return false;

      return true;
    }),
  lastName: Yup.string()
    .required(validationTexts.requireText)
    .test('validLastName', validationTexts.validLastName, (values) => {
      if (/\d/.test(values || '')) return false;

      return true;
    }),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(/^(86|\+3706)\d{7}$/, validationTexts.badPhoneFormat),
  email: Yup.string().email(validationTexts.badEmailFormat).required(validationTexts.requireText),
  groups: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(validationTexts.requireText),
        role: Yup.string().required(validationTexts.requireText),
      }),
    )
    .min(1),
});

const UserForm = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const currentUser = useAppSelector((state) => state.user.userData);
  const [searchParams] = useSearchParams();
  const { group } = Object.fromEntries([...Array.from(searchParams)]);

  const title = isNew(id) ? pageTitles.newUser : pageTitles.updateUser;

  const { isFetching, data: user } = useQuery(['userModuleUser', id], () => Api.getUser({ id }), {
    onError: () => {
      navigate(slugs.users);
    },
    onSuccess: () => {
      if (isCurrentUser(id, currentUser.id)) return navigate(slugs.profile);
    },
    enabled: !isNew(id),
  });

  const handleSubmit = async (values: User, { setErrors }) => {
    const { firstName, lastName, email, phone, groups } = values;

    const params = {
      firstName,
      lastName,
      email: email?.toLowerCase(),
      phone,
      groups,
    };

    if (isNew(id)) {
      try {
        await createUser.mutateAsync(params);
      } catch (e: any) {
        const error = e as ReactQueryError;
        const errorMessage = getReactQueryErrorMessage(error.response.data.message);
        setErrors({ email: errorMessage });
      }
      return;
    }

    return await updateUser.mutateAsync(params);
  };

  const createUser = useMutation((params: User) => Api.createUser({ params }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: (response) => {
      if (response?.url) {
        const url = new URL(response?.url);
        url.hostname = window.location.hostname;
        url.port = window.location.port;
        url.protocol = window.location.protocol;
        console.log(url.href);
        alert(url.href);
      }
      navigate(slugs.users);
    },
    retry: false,
  });

  const updateUser = useMutation((params: User) => Api.updateUser({ params, id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      navigate(slugs.users);
    },
    retry: false,
  });

  const { data: groupOptions = [] } = useQuery(
    ['groupOptions', id],
    async () => (await Api.getGroupsOptions()).rows,
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const handleDelete = useMutation(
    () =>
      Api.deleteUser({
        id,
      }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      onSuccess: () => {
        navigate(slugs.users);
      },
    },
  );

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.deleteUser,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.user,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.user,
    deleteTitle: deleteTitles.user,
    deleteName: user?.fullName,
    handleDelete: !isNew(id) ? handleDelete.mutateAsync : undefined,
  };

  const getUserGroups = () =>
    user?.groups?.map((group) => {
      return {
        id: group.id,
        role: group.role,
      };
    }) || [
      {
        id: group || '',
        role: '',
      },
    ];

  const initialValues: User = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    groups: getUserGroups(),
  };

  const renderForm = (values: User, errors: any, handleChange) => {
    return (
      <Column>
        <SimpleContainer title={formLabels.userInfo}>
          <FormRow columns={2}>
            <TextField
              label={inputLabels.firstName}
              value={values.firstName}
              error={errors.firstName}
              name="firstName"
              onChange={(firstName) => handleChange('firstName', firstName?.trim())}
            />
            <TextField
              label={inputLabels.lastName}
              name="lastName"
              value={values.lastName}
              error={errors.lastName}
              onChange={(lastName) => handleChange('lastName', lastName?.trim())}
            />
          </FormRow>
          <FormRow columns={2}>
            <TextField
              label={inputLabels.phone}
              value={values.phone}
              error={errors.phone}
              name="phone"
              placeholder="868888888"
              onChange={(phone) => handleChange('phone', phone)}
            />
            <TextField
              label={inputLabels.email}
              name="email"
              type="email"
              placeholder="vardas.pavardė@ltusportas.lt"
              value={values.email}
              error={errors.email}
              onChange={(email) => handleChange('email', email)}
            />
          </FormRow>
        </SimpleContainer>
        <SimpleContainer title={formLabels.roles}>
          <GroupsContainer
            handleChange={handleChange}
            values={values}
            groupOptions={groupOptions}
            errors={errors}
          />
        </SimpleContainer>
      </Column>
    );
  };

  if (isFetching) {
    return <FullscreenLoader />;
  }

  return (
    <FormPageWrapper
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateCreateUserForm}
      deleteInfo={deleteInfo}
    />
  );
};

export default UserForm;
