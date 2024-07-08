import { Form, Formik } from 'formik';
import { isEmpty, isEqual } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import * as Yup from 'yup';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import AsyncSelectField from '../components/fields/AsyncSelectField';
import DateField from '../components/fields/DateField';
import NumericTextField from '../components/fields/NumericTextField';
import SelectField from '../components/fields/SelectField';
import TextField from '../components/fields/TextField';
import FullscreenLoader from '../components/other/FullscreenLoader';
import InfoRow from '../components/other/InfoRow';
import InnerContainerRow from '../components/other/InnerContainerRow';
import SimpleContainer from '../components/other/SimpleContainer';
import { device } from '../styles';
import { FormRow } from '../styles/CommonStyles';
import { Rent } from '../types';
import api from '../utils/api';
import { ScholarshipType } from '../utils/constants';
import {
  formatDate,
  getBonusResultLabel,
  getFullName,
  getRentsUnitList,
  getSportsPersonList,
  handleErrorToastFromServer,
  isNew,
} from '../utils/functions';
import { useGenericTablePageHooks } from '../utils/hooks';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  inputLabels,
  pageTitles,
  scholarshipTypeLabel,
  validationTexts,
} from '../utils/texts';

const schema = Yup.object().shape({
  sportsPerson: Yup.object().required(validationTexts.requireText),
  result: Yup.object().required(validationTexts.requireText),
  documentNumber: Yup.string().required(validationTexts.requireText),
  amount: Yup.string().required(validationTexts.requireText),
  date: Yup.date().required(validationTexts.requireText),
  dateFrom: Yup.date().required(validationTexts.requireText),
  unit: Yup.object().required(validationTexts.requireText),
  data: Yup.lazy((_, ctx) => {
    const { status } = ctx.parent;

    if (isEqual(status, ScholarshipType.ACTIVE)) return Yup.mixed().notRequired();

    const obj: any = {
      from: Yup.date().required(validationTexts.requireText),
      reason: Yup.string().required(validationTexts.requireText),
    };

    if (isEqual(status, ScholarshipType.SUSPENDED)) {
      obj.renewFrom = Yup.date().required(validationTexts.requireText);
    }

    if (!isEmpty(obj)) return Yup.object().shape(obj);

    return Yup.mixed().notRequired();
  }),
});

const RentForm = () => {
  const { navigate, id } = useGenericTablePageHooks();
  const [validateOnChange, setValidateOnChange] = useState(false);

  const { isLoading: rentLoading, data: rent } = useQuery(['rent', id], () => api.getRent({ id }), {
    onError: () => {
      navigate(slugs.rents);
    },
    refetchOnWindowFocus: false,
    enabled: !isNew(id),
  });

  const handleSuccess = () => {
    navigate(slugs.rents);
  };

  const getPayload = (params: Rent) => ({
    ...params,
    result: params.result?.id,
    sportsPerson: params.sportsPerson?.id,
    unit: params.unit?.id,
  });

  const createOrUpdateBonus = useMutation(
    (params: any) =>
      isNew(id)
        ? api.createRent({ params: getPayload(params) })
        : api.updateRent({ params: getPayload(params), id }),
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

  if (rent?.createdAt) {
    info.push(formatDate(rent?.createdAt));
  }

  if (rentLoading) return <FullscreenLoader />;

  const initialValues: Rent = {
    sportsPerson: rent?.sportsPerson,
    result: rent?.result,
    documentNumber: rent?.documentNumber || '',
    date: rent?.date || undefined,
    dateFrom: rent?.dateFrom || undefined,
    unit: rent?.unit || undefined,
    amount: rent?.amount || '',
    status: rent?.status || ScholarshipType.ACTIVE,
    data: rent?.data || undefined,
  };

  return (
    <Container>
      <InnerContainer>
        <TitleColumn>
          <BackButton />
          <Row>
            <Title>{!!rent ? 'Atnaujinti rentą' : 'Nauja renta'}</Title>
          </Row>
          <InfoRow info={info} />
        </TitleColumn>

        <InnerContainerRow title={pageTitles.rentInfo} description={'Aprašymas'} />
      </InnerContainer>
      <FormContainer>
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={(data) => createOrUpdateBonus.mutateAsync(data)}
          validationSchema={schema}
        >
          {({ values, errors, setFieldValue }) => {
            const sportsPersonId = values?.sportsPerson?.id;
            const { data: results = [] } = useQuery(
              ['results', sportsPersonId],
              async () =>
                api.getResults({
                  query: {
                    // sportsPersons: {
                    //   $elemMatch: {
                    //     $in: [3],
                    //   },
                    // },
                  },
                }),
              { enabled: !!sportsPersonId },
            );

            const isSuspended = values?.status === ScholarshipType.SUSPENDED;

            return (
              <Form>
                <SimpleContainer>
                  <FormRow columns={1}>
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
                  </FormRow>
                  <FormRow columns={2}>
                    <SelectField
                      label={inputLabels.result}
                      value={values?.result}
                      error={errors?.result}
                      disabled={!sportsPersonId}
                      options={results}
                      name="result"
                      onChange={(result) => {
                        setFieldValue(`result`, result);
                      }}
                      getOptionLabel={getBonusResultLabel}
                    />
                    <TextField
                      label={inputLabels.document}
                      error={errors.documentNumber}
                      value={values.documentNumber}
                      name="documentNumber"
                      onChange={(input) => setFieldValue(`documentNumber`, input)}
                    />
                  </FormRow>
                  <FormRow columns={3}>
                    <DateField
                      name={'date'}
                      label={inputLabels.appointmentDate}
                      value={values?.date}
                      error={errors?.date}
                      onChange={(date) => setFieldValue(`date`, date)}
                    />
                    <NumericTextField
                      label={inputLabels.rentAmount}
                      error={errors.amount}
                      value={values.amount}
                      name="amount"
                      onChange={(input) => setFieldValue(`amount`, input)}
                    />
                    <AsyncSelectField
                      label={inputLabels.rentUnit}
                      value={values?.unit}
                      error={errors?.unit}
                      name="unit"
                      onChange={(unit) => {
                        setFieldValue(`unit`, unit);
                      }}
                      getOptionLabel={(option) => option?.name}
                      loadOptions={(input, page) => getRentsUnitList(input, page)}
                    />
                  </FormRow>
                  <FormRow columns={2}>
                    <DateField
                      name={'dateFrom'}
                      label={inputLabels.appointmentDateFrom}
                      value={values?.dateFrom}
                      error={errors?.dateFrom}
                      onChange={(date) => setFieldValue(`dateFrom`, date)}
                    />

                    <ButtonsGroup
                      onChange={(value) => {
                        setFieldValue('data', {});
                        setFieldValue('status', value);
                      }}
                      label={inputLabels.bonusType}
                      error={errors?.status}
                      options={Object.values(ScholarshipType)}
                      getOptionLabel={(option) => scholarshipTypeLabel[option]}
                      isSelected={(options) => options === values?.status}
                    />
                  </FormRow>
                  {ScholarshipType.ACTIVE !== values.status && (
                    <FormRow columns={isSuspended ? 3 : 2}>
                      <DateField
                        name={'from'}
                        label={isSuspended ? inputLabels.suspendedFrom : inputLabels.terminatedFrom}
                        value={values?.data?.from}
                        error={(errors as any)?.data?.from}
                        onChange={(date) => setFieldValue(`data.from`, date)}
                      />
                      <TextField
                        label={
                          isSuspended ? inputLabels.suspendedReason : inputLabels.terminatedReason
                        }
                        error={(errors as any)?.data?.reason}
                        value={values?.data?.reason}
                        name="reason"
                        onChange={(input) => setFieldValue(`data.reason`, input)}
                      />
                      {isSuspended && (
                        <DateField
                          name={'renewFrom'}
                          label={inputLabels.updated}
                          value={values?.data?.renewFrom}
                          error={(errors as any)?.data?.renewFrom}
                          onChange={(date) => setFieldValue(`data.renewFrom`, date)}
                        />
                      )}
                    </FormRow>
                  )}
                </SimpleContainer>

                <ButtonRow>
                  <Button
                    disabled={createOrUpdateBonus.isLoading || deleteRent.isLoading}
                    loading={createOrUpdateBonus.isLoading}
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

export default RentForm;
