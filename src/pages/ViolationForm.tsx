import { Form, Formik } from 'formik';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import * as Yup from 'yup';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import AsyncSelectField from '../components/fields/AsyncSelectField';
import DateField from '../components/fields/DateField';
import SelectField from '../components/fields/SelectField';
import TextAreaField from '../components/fields/TextAreaField';
import FullscreenLoader from '../components/other/FullscreenLoader';
import InfoRow from '../components/other/InfoRow';
import InnerContainerRow from '../components/other/InnerContainerRow';
import SimpleContainer from '../components/other/SimpleContainer';
import { device } from '../styles';
import { FormRow } from '../styles/CommonStyles';
import { Violation } from '../types';
import api from '../utils/api';
import { PenaltyType, ViolationType } from '../utils/constants';
import {
  formatDate,
  getBonusResultLabel,
  getDisqualificationReasons,
  getFullName,
  getSportsPersonList,
  getSportTypesList,
  handleErrorToastFromServer,
  isNew,
} from '../utils/functions';
import { useGenericTablePageHooks } from '../utils/hooks';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  inputLabels,
  pageTitles,
  penaltyTypeLabel,
  validationTexts,
  violationTypeLabels,
} from '../utils/texts';

const schema = Yup.lazy((_, ctx: any) => {
  const { type } = ctx.context;

  const obj: any = {
    type: Yup.string().required(validationTexts.requireText),
    description: Yup.string().required(validationTexts.requireText),
  };

  if (isEqual(type, ViolationType.DOPING)) {
    const { penaltyType } = ctx.context;
    obj.sportsPerson = Yup.object().required(validationTexts.requireText);
    obj.sportType = Yup.object().required(validationTexts.requireText);
    obj.dateFrom = Yup.date().required(validationTexts.requireText);
    obj.dateTo = Yup.date().required(validationTexts.requireText);
    obj.penaltyType = Yup.string().required(validationTexts.requireText);

    if (isEqual(penaltyType, PenaltyType.DISQUALIFICATION)) {
      obj.disqualificationReason = Yup.object().required(validationTexts.requireText);
    }
  } else {
    obj.competitionResult = Yup.object().required(validationTexts.requireText);
    obj.invalidateResult = Yup.boolean().required(validationTexts.requireText);
  }

  return Yup.object().shape(obj);
});

const ViolationForm = () => {
  const { navigate, id } = useGenericTablePageHooks();
  const [validateOnChange, setValidateOnChange] = useState(false);

  const { isLoading: violationLoading, data: violation } = useQuery(
    ['violation', id],
    () => api.getViolation({ id }),
    {
      onError: () => {
        navigate(slugs.violations);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const handleSuccess = () => {
    navigate(slugs.violations);
  };

  const getPayload = (params: Violation) => ({
    ...params,
    sportsPerson: params.sportsPerson?.id,
    sportType: params.sportType?.id,
    competitionResult: params.competitionResult?.id,
    disqualificationReason: params.disqualificationReason?.id,
  });

  const createOrUpdateViolation = useMutation(
    (params: any) =>
      isNew(id)
        ? api.createViolation({ params: getPayload(params) })
        : api.updateViolation({ params: getPayload(params), id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleSuccess,
      retry: false,
    },
  );

  const deleteRent = useMutation(({ id }: any) => api.deleteRent({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: handleSuccess,
    retry: false,
  });

  const info: any = [];

  if (violation?.createdAt) {
    info.push(formatDate(violation?.createdAt));
  }

  if (violationLoading) return <FullscreenLoader />;

  const initialValues: Violation = {
    sportsPerson: violation?.sportsPerson,
    sportType: violation?.sportType,
    disqualificationReason: violation?.disqualificationReason,
    type: violation?.type || ViolationType.DOPING,
    dateTo: violation?.dateTo || undefined,
    dateFrom: violation?.dateFrom || undefined,
    penaltyType: violation?.penaltyType,
    description: violation?.description || '',
    invalidateResult: violation?.invalidateResult,
    competitionResult: violation?.competitionResult,
  };

  return (
    <Container>
      <InnerContainer>
        <TitleColumn>
          <BackButton />
          <Row>
            <Title>{!!violation ? 'Atnaujinti pažeidimą' : 'Naujas pažeidimas'}</Title>
          </Row>
          <InfoRow info={info} />
        </TitleColumn>

        <InnerContainerRow title={pageTitles.violationInfo} description={'Aprašymas'} />
      </InnerContainer>
      <FormContainer>
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={(data) => createOrUpdateViolation.mutateAsync(data)}
          validationSchema={schema}
        >
          {({ values, errors, setFieldValue, resetForm }) => {
            const { data: results = [] } = useQuery(
              ['results', values.type],
              async () => api.getResults({}),
              { enabled: values.type == ViolationType.MANIPULATION },
            );

            return (
              <Form>
                <SimpleContainer>
                  <FormRow columns={1}>
                    <SelectField
                      label={inputLabels.violationType}
                      value={values.type}
                      error={errors?.type}
                      name="ViolationType"
                      getOptionLabel={(option) => violationTypeLabels[option]}
                      options={Object.values(ViolationType)}
                      onChange={(type) => {
                        resetForm();
                        setFieldValue(`type`, type);
                      }}
                    />
                  </FormRow>

                  {ViolationType.DOPING === values.type ? (
                    <>
                      <FormRow columns={2}>
                        <AsyncSelectField
                          label={inputLabels.athlete}
                          value={values?.sportsPerson}
                          error={errors?.sportsPerson}
                          name="sportsPerson"
                          onChange={(sportsPerson) => {
                            setFieldValue(`sportsPerson`, sportsPerson);
                          }}
                          getOptionLabel={(option) => getFullName(option)}
                          loadOptions={(input, page) =>
                            getSportsPersonList(input, page, { athlete: { $exists: true } })
                          }
                        />
                        <AsyncSelectField
                          label={inputLabels.sportType}
                          value={values.sportType}
                          error={errors?.sportType}
                          name="sportTypes"
                          onChange={(sportType) => {
                            setFieldValue('sportType', sportType);
                          }}
                          getOptionLabel={(option) => option?.name}
                          loadOptions={(input, page) => getSportTypesList(input, page)}
                        />
                      </FormRow>
                      <FormRow columns={3}>
                        <DateField
                          name={'dateFrom'}
                          label={inputLabels.dateFrom}
                          value={values?.dateFrom}
                          maxDate={values?.dateTo}
                          error={errors?.dateFrom}
                          onChange={(date) => setFieldValue(`dateFrom`, date)}
                        />
                        <DateField
                          name={'dateTo'}
                          label={inputLabels.dateTo}
                          value={values?.dateTo}
                          minDate={values?.dateFrom}
                          error={errors?.dateTo}
                          onChange={(date) => setFieldValue(`dateTo`, date)}
                        />

                        <ButtonsGroup
                          onChange={(value) => {
                            setFieldValue('penaltyType', value);
                            setFieldValue('disqualificationReason', undefined);
                          }}
                          label={inputLabels.penaltyType}
                          error={errors?.penaltyType}
                          options={Object.values(PenaltyType)}
                          getOptionLabel={(option) => penaltyTypeLabel[option]}
                          isSelected={(options) => options === values?.penaltyType}
                        />
                      </FormRow>
                      <FormRow columns={1}>
                        {PenaltyType.DISQUALIFICATION === values?.penaltyType && (
                          <AsyncSelectField
                            label={inputLabels.disqualificationReason}
                            value={values.disqualificationReason}
                            error={errors?.disqualificationReason}
                            name="disqualificationReason"
                            onChange={(disqualificationReason) => {
                              setFieldValue('disqualificationReason', disqualificationReason);
                            }}
                            getOptionLabel={(option) => option?.name}
                            loadOptions={(input, page) => getDisqualificationReasons(input, page)}
                          />
                        )}
                      </FormRow>
                    </>
                  ) : (
                    <FormRow columns={2}>
                      <SelectField
                        label={inputLabels.result}
                        value={values?.competitionResult}
                        error={errors?.competitionResult}
                        options={results}
                        name="competitionResult"
                        onChange={(result) => {
                          setFieldValue(`competitionResult`, result);
                        }}
                        getOptionLabel={getBonusResultLabel}
                      />
                      <ButtonsGroup
                        label={inputLabels.invalidateResult}
                        onChange={(value) => setFieldValue('invalidateResult', value)}
                        options={[true, false]}
                        error={errors?.invalidateResult}
                        getOptionLabel={(option) => (option ? 'Taip' : 'Ne')}
                        isSelected={(options) => options === values?.invalidateResult}
                      />
                    </FormRow>
                  )}

                  <FormRow columns={1}>
                    <TextAreaField
                      label={inputLabels.description}
                      error={errors?.description}
                      value={values?.description}
                      name="description"
                      onChange={(input) => setFieldValue(`description`, input)}
                    />
                  </FormRow>
                </SimpleContainer>

                <ButtonRow>
                  <Button
                    disabled={createOrUpdateViolation.isLoading || deleteRent.isLoading}
                    loading={createOrUpdateViolation.isLoading}
                    type="submit"
                  >
                    {buttonsTitles.submit}
                  </Button>
                </ButtonRow>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    </Container>
  );
};

const FormContainer = styled.div`
  padding: 0px 16px;
  min-height: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 32px 0 16px 0;
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
  flex-direction: column;
`;

export default ViolationForm;
