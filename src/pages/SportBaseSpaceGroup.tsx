import { ButtonsGroup } from '@aplinkosministerija/design-system';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import * as Yup from 'yup';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import DeleteButton from '../components/buttons/DeleteButton';
import TextField from '../components/fields/TextField';
import Popup from '../components/layouts/Popup';
import EditIcon from '../components/other/EditIcon';
import FullscreenLoader from '../components/other/FullscreenLoader';
import InnerContainerRow from '../components/other/InnerContainerRow';
import MainTable from '../components/tables/MainTable';
import { device } from '../styles';
import { FormRow } from '../styles/CommonStyles';
import { SportBaseSpaceType, TableRow } from '../types';
import api from '../utils/api';
import { ClassifierTypes } from '../utils/constants';
import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../utils/texts';

const mapType = (types: SportBaseSpaceType[]): TableRow[] => {
  return types.map((type: SportBaseSpaceType) => {
    return {
      id: type.id,
      name: type.name,
      needSportType: type.needSportType ? 'Taip' : 'Ne',
    };
  });
};

const schema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
});

const matchLabels = {
  name: { label: inputLabels.name, show: true },
  needSportType: { label: inputLabels.needSportType, show: true },
};

const SportBaseSpaceGroup = () => {
  const { navigate, page, id, pageSize } = useGenericTablePageHooks();
  const [current, setCurrent] = useState<SportBaseSpaceType>();
  const [validateOnChange, setValidateOnChange] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = ['sportBaseSpaceGroup', id];

  const { isLoading: sportTypeLoading, data: sportType } = useQuery(
    queryKey,
    () => api.getSportBaseSpaceGroup({ id }),
    {
      onError: () => {
        navigate(slugs.classifiers(ClassifierTypes.SPORTS_BASE_SPACE_GROUP));
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const handleSuccess = () => {
    setCurrent(undefined);
    queryClient.invalidateQueries(['sportsBaseSpaceType', id, page, pageSize]);
  };

  const createOrUpdateType = useMutation(
    (params: any) =>
      !params?.id
        ? api.createSportBaseSpaceType({ params: { ...params, group: id } })
        : api.updateSportBaseSpaceType({ params: { ...params, group: id }, id: params?.id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleSuccess,
      retry: false,
    },
  );

  const deleteType = useMutation(({ id }: any) => api.deleteSportBaseSpaceType({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: handleSuccess,
    retry: false,
  });

  const { tableData, loading } = useTableData({
    name: 'sportsBaseSpaceType',
    endpoint: () => api.getSportsBaseSpaceTypes({ query: { group: id }, page, pageSize }),
    mapData: (list) => list,
    dependencyArray: [id, page, pageSize],
  });

  if (sportTypeLoading) return <FullscreenLoader />;

  const initialValues = current!;

  const data = tableData?.data as SportBaseSpaceType[];

  return (
    <Container>
      <InnerContainer>
        <TitleColumn>
          <BackButton />
          <Row>
            <Title>{sportType?.name}</Title>
            <EditIcon
              onClick={() => {
                navigate(slugs.updateSportsBaseSpaceGroup(id));
              }}
            />
          </Row>
        </TitleColumn>

        <InnerContainerRow
          title={pageTitles.sportsBaseSpaceTypes}
          description={descriptions.sportsBaseSpaceTypes}
          buttonTitle={buttonsTitles.addSportsBaseSpaceTypes}
          onCreateNew={() => setCurrent({} as any)}
        />
        <MainTable
          notFoundInfo={{ text: 'Nėra sukurta sporto bazės erdvės tipų' }}
          isFilterApplied={false}
          data={{ ...tableData, data: mapType(data) }}
          columns={matchLabels}
          onClick={(id) => setCurrent(data.find((item) => item.id?.toString() === id))}
          loading={loading}
        />
      </InnerContainer>

      <Popup title={formLabels.addMatch} visible={!!current} onClose={() => setCurrent(undefined)}>
        <FormContainer>
          <Formik
            validateOnChange={validateOnChange}
            enableReinitialize={false}
            initialValues={initialValues}
            validate={() => {
              setValidateOnChange(true);
            }}
            onSubmit={(data) => createOrUpdateType.mutateAsync(data)}
            validationSchema={schema}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <Form>
                  <FormRow columns={2}>
                    <TextField
                      label={inputLabels.matchName}
                      value={values?.name}
                      error={errors?.name}
                      name="name"
                      onChange={(name) => {
                        setFieldValue(`name`, name);
                      }}
                    />
                    <ButtonsGroup
                      onChange={(value) => setFieldValue('needSportType', value)}
                      label={inputLabels.needSportType}
                      options={[true, false]}
                      getOptionLabel={(option) => (option ? 'Taip' : 'Ne')}
                      isSelected={(options) => options === values.needSportType}
                    />
                  </FormRow>

                  <ButtonRow>
                    {values.id && (
                      <StyledButton
                        disabled={createOrUpdateType.isLoading || deleteType.isLoading}
                        loading={deleteType.isLoading}
                        onClick={() => {
                          deleteType.mutateAsync({ id: values.id });
                        }}
                      />
                    )}
                    <Button
                      disabled={createOrUpdateType.isLoading || deleteType.isLoading}
                      loading={createOrUpdateType.isLoading}
                      type="submit"
                    >
                      {buttonsTitles.save}
                    </Button>
                  </ButtonRow>
                </Form>
              );
            }}
          </Formik>
        </FormContainer>
      </Popup>
    </Container>
  );
};

const StyledButton = styled(DeleteButton)`
  border: none;
  gap: 0;
  padding-left: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 32px 0 16px 0;
`;

const FormContainer = styled.div`
  min-width: 500px;
  @media ${device.mobileL} {
    min-width: auto;
  }
`;

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: #121926;
  opacity: 1;
  @media ${device.mobileL} {
    font-size: 2.4rem;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  margin: 0 auto;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleColumn = styled.div`
  display: flex;
  gap: 16px;
  margin: -16px -16px 12px -16px;
  padding: 16px 16px 0 16px;
  flex-direction: column;
  background-color: white;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media ${device.mobileL} {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

export default SportBaseSpaceGroup;
