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
import { ScholarShip } from '../types';
import api from '../utils/api';
import { ScholarshipType } from '../utils/constants';
import {
  formatDate,
  getBonusResultLabel,
  getFullName,
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
  dateTo: Yup.date().required(validationTexts.requireText),
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

const ScholarshipForm = () => {
  const { navigate, id } = useGenericTablePageHooks();
  const [validateOnChange, setValidateOnChange] = useState(false);

  const { isLoading: scholarshipLoading, data: scholarship } = useQuery(
    ['scholarship', id],
    () => api.getScholarship({ id }),
    {
      onError: () => {
        navigate(slugs.scholarships);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const handleSuccess = () => {
    navigate(slugs.scholarships);
  };

  const getPayload = (params: ScholarShip) => ({
    ...params,
    result: params.result?.id,
    sportsPerson: params.sportsPerson?.id,
  });

  const createOrUpdateScholarship = useMutation(
    (params: any) =>
      isNew(id)
        ? api.createScholarship({ params: getPayload(params) })
        : api.updateScholarship({ params: getPayload(params), id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleSuccess,
      retry: false,
    },
  );

  const deleteScholarship = useMutation(({ id }: any) => api.deleteScholarship({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: handleSuccess,
    retry: false,
  });

  const info: any = [];

  if (scholarship?.createdAt) {
    info.push(formatDate(scholarship?.createdAt));
  }

  if (scholarshipLoading) return <FullscreenLoader />;

  const initialValues: ScholarShip = {
    sportsPerson: scholarship?.sportsPerson,
    result: scholarship?.result,
    documentNumber: scholarship?.documentNumber || '',
    date: scholarship?.date || undefined,
    dateFrom: scholarship?.dateFrom || undefined,
    dateTo: scholarship?.dateTo || undefined,
    amount: scholarship?.amount || '',
    status: scholarship?.status || ScholarshipType.ACTIVE,
    data: scholarship?.data || undefined,
  };

  return (
    <Container>
      <InnerContainer>
        <TitleColumn>
          <BackButton />
          <Row>
            <Title>{!!scholarship ? 'Atnaujinti stipendiją' : 'Nauja stipendija'}</Title>
          </Row>
          <InfoRow info={info} />
        </TitleColumn>

        <InnerContainerRow title={pageTitles.scholarshipInfo} description={'Aprašymas'} />
      </InnerContainer>
      <FormContainer>
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={(data) => createOrUpdateScholarship.mutateAsync(data)}
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
                    <DateField
                      name={'date'}
                      label={inputLabels.appointmentDate}
                      value={values?.date}
                      error={errors?.date}
                      onChange={(date) => setFieldValue(`date`, date)}
                    />
                    <NumericTextField
                      label={inputLabels.scholarshipAmount}
                      error={errors.amount}
                      value={values.amount}
                      name="amount"
                      onChange={(input) => setFieldValue(`amount`, input)}
                    />
                  </FormRow>
                  <FormRow columns={3}>
                    <DateField
                      name={'dateFrom'}
                      label={inputLabels.appointmentDateFrom}
                      value={values?.dateFrom}
                      maxDate={values?.dateTo}
                      error={errors?.dateFrom}
                      onChange={(date) => setFieldValue(`dateFrom`, date)}
                    />
                    <DateField
                      name={'dateTo'}
                      label={inputLabels.appointmentDateTo}
                      value={values?.dateTo}
                      minDate={values?.dateFrom}
                      error={errors?.dateTo}
                      onChange={(date) => setFieldValue(`dateTo`, date)}
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
                    disabled={createOrUpdateScholarship.isLoading || deleteScholarship.isLoading}
                    loading={createOrUpdateScholarship.isLoading}
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

export default ScholarshipForm;
