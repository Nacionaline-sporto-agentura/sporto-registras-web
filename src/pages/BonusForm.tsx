import { Form, Formik } from 'formik';
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
import { Bonus } from '../types';
import api from '../utils/api';
import { BonusType } from '../utils/constants';
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
  bonusTypeLabels,
  buttonsTitles,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../utils/texts';

const schema = Yup.object().shape({
  sportsPerson: Yup.object().required(validationTexts.requireText),
  result: Yup.object().required(validationTexts.requireText),
  documentNumber: Yup.string().required(validationTexts.requireText),
  amount: Yup.string().required(validationTexts.requireText),
  date: Yup.date().required(validationTexts.requireText),
});

const BonusForm = () => {
  const { navigate, id } = useGenericTablePageHooks();
  const [validateOnChange, setValidateOnChange] = useState(false);

  const { isLoading: bonusLoading, data: bonus } = useQuery(
    ['bonus', id],
    () => api.getBonus({ id }),
    {
      onError: () => {
        navigate(slugs.bonuses);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const handleSuccess = () => {
    navigate(slugs.bonuses);
  };

  const getPayload = (params: Bonus) => ({
    ...params,
    result: params.result?.id,
    sportsPerson: params.sportsPerson?.id,
  });

  const createOrUpdateBonus = useMutation(
    (params: any) =>
      isNew(id)
        ? api.createBonus({ params: getPayload(params) })
        : api.updateBonus({ params: getPayload(params), id }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: handleSuccess,
      retry: false,
    },
  );

  const deleteMatch = useMutation(({ id }: any) => api.deleteBonus({ id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: handleSuccess,
    retry: false,
  });

  const info: any = [];

  if (bonus?.createdAt) {
    info.push(formatDate(bonus?.createdAt));
  }

  if (bonusLoading) return <FullscreenLoader />;

  const initialValues: Bonus = {
    sportsPerson: bonus?.sportsPerson,
    result: bonus?.result,
    documentNumber: bonus?.documentNumber || '',
    date: bonus?.date || undefined,
    amount: bonus?.amount || '',
    type: bonus?.type || BonusType.NATIONAL,
  };

  return (
    <Container>
      <InnerContainer>
        <TitleColumn>
          <BackButton />
          <Row>
            <Title>{!!bonus ? 'Atnaujinti premiją' : 'Nauja premija'}</Title>
          </Row>
          <InfoRow info={info} />
        </TitleColumn>

        <InnerContainerRow title={pageTitles.bonusInfo} description={'Aprašymas'} />
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

            return (
              <Form>
                <SimpleContainer>
                  <FormRow columns={2}>
                    <AsyncSelectField
                      label={inputLabels.sportsPerson}
                      value={values?.sportsPerson}
                      error={errors?.sportsPerson}
                      name="sportsPerson"
                      onChange={(sportsPerson) => {
                        setFieldValue(`sportsPerson`, sportsPerson);
                      }}
                      getOptionLabel={(option) => getFullName(option)}
                      loadOptions={(input, page) => getSportsPersonList(input, page)}
                    />
                    <ButtonsGroup
                      onChange={(value) => setFieldValue('type', value)}
                      label={inputLabels.bonusType}
                      error={errors?.type}
                      options={Object.values(BonusType)}
                      getOptionLabel={(option) => bonusTypeLabels[option]}
                      isSelected={(options) => options === values.type}
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
                      label={inputLabels.bonusAmount}
                      error={errors.amount}
                      value={values.amount}
                      name="amount"
                      onChange={(input) => setFieldValue(`amount`, input)}
                    />
                  </FormRow>
                </SimpleContainer>

                <ButtonRow>
                  <Button
                    disabled={createOrUpdateBonus.isLoading || deleteMatch.isLoading}
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

export default BonusForm;
