import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelectField, SelectField, TreeSelectField } from '@aplinkosministerija/design-system';
import { App, DeleteInfoProps, Group, Permission } from '../types';
import { isNew } from '../utils/functions';
import Api from '../utils/api';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  featureLabels,
  formLabels,
  inputLabels,
  pageTitles,
  roleLabels,
} from '../utils/texts';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import { validatePermissionForm } from './GroupForm';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import styled from 'styled-components';
import { AdminRoleType, Apps, Features } from '../utils/constants';
import { slugs } from '../utils/routes';

const PermissionFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const title = isNew(id) ? pageTitles.newPermission : pageTitles.updatePermission;
  const allFeatures: string[] = Object.values(Features) || [];

  const handleSubmit = async (data: Permission) => {
    const selectedAllFeatures = data.features?.length === allFeatures.length;

    const params: Permission = {
      ...data,
      ...(selectedAllFeatures ? { features: ['*'] } : {}),
    };

    if (isNew(id)) {
      return await createPermission.mutateAsync(params);
    }

    return await updatePermission.mutateAsync(params);
  };

  const createPermission = useMutation((params: Permission) => Api.createPermission({ params }), {
    onError: () => {},
    onSuccess: () => {
      navigate(slugs.permissions);
    },
    retry: false,
  });

  const updatePermission = useMutation(
    (params: Permission) => Api.updatePermission({ params, id: id! }),
    {
      onError: () => {},
      onSuccess: () => {
        navigate(slugs.permissions);
      },
      retry: false,
    },
  );

  const handleDelete = useMutation(
    () =>
      Api.deletePermission({
        id,
      }),
    {
      onError: () => {},
      onSuccess: () => {
        navigate(slugs.permissions);
      },
    },
  );

  const { isLoading, data: permission } = useQuery(
    ['permission', id],
    () => Api.getPermission({ id }),
    {
      onError: () => {
        navigate(slugs.permissions);
      },
      enabled: !isNew(id),
    },
  );

  const { data: groupOptions = [] } = useQuery(
    ['groupOptions'],
    async () => (await Api.getPermissionGroups()).rows,
    {
      onError: () => {},
    },
  );

  const apps = groupOptions?.map((option: Group<App>) => option.apps)?.flat() || [];
  const registrasApp = apps.find((app) => app.type === Apps.REGISTRAS);

  const initialValues: Permission = {
    group: permission?.group?.id || undefined,
    app: registrasApp?.id,
    role: permission?.role || AdminRoleType.USER,
    features: permission?.features
      ? !permission.features.includes('*')
        ? permission.features
        : allFeatures
      : allFeatures,
  };

  const renderForm = (values, errors, handleChange) => {
    return (
      <SimpleContainer title={formLabels.permissions}>
        <Row>
          <TreeSelectField
            label={inputLabels.group}
            name={`group`}
            error={errors?.group}
            groupOptions={groupOptions}
            value={values.group}
            onChange={(group) => handleChange(`group`, group?.id)}
          />
          <SelectField
            options={Object.values(AdminRoleType)}
            label={inputLabels.role}
            error={errors?.role}
            value={values?.role}
            onChange={(role) => handleChange(`role`, role)}
            getOptionLabel={(role) => roleLabels[role] || ''}
          />
          <MultiSelectField
            label={inputLabels.features}
            error={errors.features}
            getOptionLabel={(option) => featureLabels[option]}
            getOptionValue={(option) => option}
            disabled={false}
            values={values.features}
            options={allFeatures}
            onChange={(features) => handleChange('features', features)}
          />
        </Row>
      </SimpleContainer>
    );
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.delete,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.permission,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.permission,
    deleteTitle: deleteTitles.permission,
    deleteName: '',
    handleDelete: !isNew(id) ? handleDelete.mutateAsync : undefined,
  };

  return (
    <FormikFormLayout
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validatePermissionForm}
      deleteInfo={deleteInfo}
    />
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default PermissionFormPage;
