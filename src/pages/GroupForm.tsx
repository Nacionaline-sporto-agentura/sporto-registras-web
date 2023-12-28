import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import TextField from '../components/fields/TextField';
import TreeSelectField from '../components/fields/TreeSelect';
import FormPageWrapper from '../components/layouts/FormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import SimpleContainer from '../components/other/SimpleContainer';
import Api from '../utils/api';
import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { formLabels, inputLabels, pageTitles, validationTexts } from '../utils/texts';

export interface GroupProps {
  name?: string;
  parent?: any;
}

export const validateGroupForm = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
});

const GroupsFormPage = () => {
  const [searchParams] = useSearchParams();
  const { parent } = Object.fromEntries([...Array.from(searchParams)]);
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const title = !isNew(id) ? pageTitles.updateGroup : pageTitles.newGroup;

  const handleSubmit = async ({ name }: GroupProps) => {
    const params = {
      name,
    };

    return await createGroup.mutateAsync({
      ...(!!parent && { parent: parseInt(parent) }),
      ...params,
    });
  };

  const createGroup = useMutation(
    (params: GroupProps) =>
      isNew(id) ? Api.createGroup({ params }) : Api.updateGroup({ params, id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        navigate(slugs.groups);
      },
      retry: false,
    },
  );

  const {} = useQuery(['parentGroup', id], async () => await Api.getGroup({ id: parent }), {
    onError: () => {
      navigate(slugs.groups);
    },
    enabled: !!parent,
  });

  const { isLoading, data: group } = useQuery(['formGroup', id], () => Api.getGroup({ id }), {
    onError: () => {
      navigate(slugs.groups);
    },
    enabled: !isNew(id),
  });

  const initialValues: GroupProps = {
    name: group?.name || '',
    parent: parent || '',
  };

  const { data: groupOptions = [] } = useQuery(
    ['groupOptions', id],
    async () => (await Api.getGroupsOptions()).rows,
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const renderForm = (values: GroupProps, errors: any, handleChange) => {
    return (
      <SimpleContainer title={formLabels.groupInfo}>
        <Row>
          <TextField
            label={inputLabels.name}
            value={values.name}
            name="name"
            error={errors.name}
            onChange={(e) => handleChange('name', e)}
          />
          <TreeSelectField
            label={inputLabels.group}
            name={`group`}
            error={errors?.group}
            groupOptions={groupOptions}
            value={values.parent}
            onChange={(value) => handleChange('parent', value)}
          />
        </Row>
      </SimpleContainer>
    );
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <FormPageWrapper
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateGroupForm}
    />
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default GroupsFormPage;
