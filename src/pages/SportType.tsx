import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import * as Yup from 'yup';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import DeleteButton from '../components/buttons/DeleteButton';
import TextField from '../components/fields/TextField';
import Popup from '../components/layouts/Popup';
import EditIcon from '../components/other/EditIcon';
import FullscreenLoader from '../components/other/FullscreenLoader';
import InfoRow from '../components/other/InfoRow';
import InnerContainerRow from '../components/other/InnerContainerRow';
import MainTable from '../components/tables/MainTable';
import { device } from '../styles';
import { FormRow } from '../styles/CommonStyles';
import { Match, TableRow } from '../types';
import api from '../utils/api';
import { ClassifierTypes, MatchTypes, SportTypeButtonKeys } from '../utils/constants';
import { handleErrorToastFromServer, isNew } from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  descriptions,
  falseLabels,
  formLabels,
  inputLabels,
  matchTypeLabels,
  pageTitles,
  trueLabels,
  validationTexts,
} from '../utils/texts';

const mapMatchTypes = (matchTypes: any[]): TableRow[] => {
  return matchTypes.map((matchType: Match) => {
    return {
      id: matchType.id,
      name: matchType.name,
      olympic: matchType.olympic ? 'Olimpinė' : 'Neolimpinė',
      type: matchTypeLabels[matchType.type],
    };
  });
};

const schema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  type: Yup.string().required(validationTexts.requireText),
});

const matchLabels = {
  name: { label: inputLabels.matchName, show: true },
  olympic: { label: inputLabels.olympicMatch, show: true },
  type: { label: inputLabels.matchType, show: true },
};

const SportTypePage = () => {
  const { navigate, page, id } = useGenericTablePageHooks();
  const [current, setCurrent] = useState<Match>();
  const [validateOnChange, setValidateOnChange] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading: sportTypeLoading, data: sportType } = useQuery(
    ['sportType', id],
    () => api.getSportType({ id }),
    {
      onError: () => {
        navigate(slugs.classifiers(ClassifierTypes.SPORT_TYPE));
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const handleSuccess = () => {
    setCurrent(undefined);

    queryClient.invalidateQueries(['matches', id]);
  };

  const createOrUpdateMatch = useMutation(
    (params: any) =>
      !params?.id
        ? api.createMatchType({ params: { ...params, sportType: id } })
        : api.updateMatchType({ params: { ...params, sportType: id }, id: params?.id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleSuccess,
      retry: false,
    },
  );

  const deleteMatch = useMutation(({ id }: any) => api.deleteMatchType({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: handleSuccess,
    retry: false,
  });

  const { tableData, loading } = useTableData({
    name: 'matches',
    endpoint: () => api.getMatchTypes({ query: { sportType: id }, page }),
    mapData: (list) => list,
    dependencyArray: [id, page],
  });

  const info = [sportType?.olympic ? 'Olimpinė sporto šaka' : 'Neolimpinė sporto šaka'];

  if (sportTypeLoading) return <FullscreenLoader />;

  const initialValues = current!;

  const data = tableData?.data as Match[];

  return (
    <Container>
      <InnerContainer>
        <TitleColumn>
          <BackButton />
          <Row>
            <Title>{sportType?.name}</Title>
            <EditIcon
              onClick={() => {
                navigate(slugs.updateSportType(id));
              }}
            />
          </Row>
          <InfoRow info={info} />
        </TitleColumn>

        <InnerContainerRow
          title={pageTitles.sportMatches}
          description={descriptions.sportMatches}
          buttonTitle={buttonsTitles.addMatch}
          onCreateNew={() => setCurrent({} as any)}
        />
        <MainTable
          notFoundInfo={{ text: 'Nėra sukurta sporto rungčių' }}
          isFilterApplied={false}
          data={{ ...tableData, data: mapMatchTypes(data) }}
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
            onSubmit={(data) => createOrUpdateMatch.mutateAsync(data)}
            validationSchema={schema}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <Form>
                  <FormRow columns={1}>
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
                      onChange={(value) => setFieldValue('type', value)}
                      label={inputLabels.matchType}
                      error={errors?.type}
                      options={Object.values(MatchTypes)}
                      getOptionLabel={(option) => matchTypeLabels[option]}
                      isSelected={(options) => options === values.type}
                    />
                  </FormRow>
                  <FormRow columns={2}>
                    <ButtonsGroup
                      onChange={(value) => setFieldValue('olympic', value)}
                      label={inputLabels.isOlympic}
                      error={errors?.olympic}
                      options={[true, false]}
                      getOptionLabel={(option) =>
                        option
                          ? trueLabels[SportTypeButtonKeys.olympic]
                          : falseLabels[SportTypeButtonKeys.olympic]
                      }
                      isSelected={(options) => options === values.olympic}
                    />
                    <ButtonsGroup
                      onChange={(value) => setFieldValue('paralympic', value)}
                      label={inputLabels.isParalympic}
                      error={errors?.paralympic}
                      options={[true, false]}
                      getOptionLabel={(option) =>
                        option
                          ? trueLabels[SportTypeButtonKeys.paralympic]
                          : falseLabels[SportTypeButtonKeys.paralympic]
                      }
                      isSelected={(options) => options === values.paralympic}
                    />
                  </FormRow>
                  <FormRow columns={1}>
                    <ButtonsGroup
                      onChange={(value) => setFieldValue('deaf', value)}
                      label={inputLabels.isDeafs}
                      error={errors?.deaf}
                      options={[true, false]}
                      getOptionLabel={(option) =>
                        option
                          ? trueLabels[SportTypeButtonKeys.deaf]
                          : falseLabels[SportTypeButtonKeys.deaf]
                      }
                      isSelected={(options) => options === values.deaf}
                    />
                    <ButtonsGroup
                      onChange={(value) => setFieldValue('specialOlympics', value)}
                      label={inputLabels.isSpecialOlympic}
                      error={errors?.specialOlympics}
                      options={[true, false]}
                      getOptionLabel={(option) =>
                        option
                          ? trueLabels[SportTypeButtonKeys.specialOlympics]
                          : falseLabels[SportTypeButtonKeys.specialOlympics]
                      }
                      isSelected={(options) => options === values.specialOlympics}
                    />
                  </FormRow>
                  <ButtonRow>
                    {values.id && (
                      <StyledButton
                        disabled={createOrUpdateMatch.isLoading || deleteMatch.isLoading}
                        loading={deleteMatch.isLoading}
                        onClick={() => {
                          deleteMatch.mutateAsync({ id: values.id });
                        }}
                      />
                    )}
                    <Button
                      disabled={createOrUpdateMatch.isLoading || deleteMatch.isLoading}
                      loading={createOrUpdateMatch.isLoading}
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

export default SportTypePage;
