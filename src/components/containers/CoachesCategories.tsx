import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { CoachCategory } from '../../types';
import { formatDate, getEducationalCompaniesList } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';

interface FaInstructorFaSpecialistForm extends CoachCategory {
  index: string;
}

const schema = Yup.object().shape({
  company: Yup.object().required(validationTexts.requireText),
  category: Yup.object().required(validationTexts.requireText),
  issuedAt: Yup.date().required(validationTexts.requireText),
  expiresAt: Yup.date().required(validationTexts.requireText),
});

const labels = {
  category: { label: inputLabels.qualificationCategory, show: true },
  issuedAt: { label: inputLabels.granted, show: true },
  expiresAt: { label: inputLabels.expiresAt, show: true },
};

const CoachesCompetences = ({ competences = {}, handleChange, disabled }) => {
  const competenceKeys = Object.keys(competences);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<FaInstructorFaSpecialistForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedCompetences = { ...competences, [index]: rest };

      handleChange('coach.competences', updatedCompetences);
    } else {
      handleChange('coach.competences', {
        [generateUniqueString()]: values,
        ...competences,
      });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: competenceKeys.map((key) => {
      const competence: CoachCategory = competences?.[key];

      return {
        company: competence?.company?.name,
        category: competence?.category?.name,
        startAt: formatDate(competence?.issuedAt),
        endAt: formatDate(competence?.expiresAt),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.qualificationCategory}
        description={descriptions.qualificationCategory}
        buttonTitle={buttonsTitles.addCategory}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų kvalifikacinių kategorijų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={labels}
        onClick={(id) => {
          setCurrent({ ...competences[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addCategory}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues!}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.companyName}
                    value={values?.company}
                    error={errors?.company}
                    name="company"
                    onChange={(company) => {
                      setFieldValue(`company`, company);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getEducationalCompaniesList(input, page)}
                  />
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.grantedQualificationCategory}
                    value={values?.category}
                    error={errors?.category}
                    name="category"
                    onChange={(basis) => {
                      setFieldValue(`category`, basis);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getEducationalCompaniesList(input, page)}
                  />
                </FormRow>
                <FormRow columns={2}>
                  <DateField
                    disabled={disabled}
                    name={'startAt'}
                    label={inputLabels.issuedAt}
                    value={values?.issuedAt}
                    maxDate={values?.expiresAt}
                    error={errors?.issuedAt}
                    onChange={(startAt) => setFieldValue(`issuedAt`, startAt)}
                  />
                  <DateField
                    disabled={disabled}
                    name={'endAt'}
                    label={inputLabels.expiresAt}
                    value={values?.expiresAt}
                    minDate={values?.issuedAt}
                    error={errors?.expiresAt}
                    onChange={(endAt) => setFieldValue(`expiresAt`, endAt)}
                  />
                </FormRow>
                <FormRow columns={1}>
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('coach.competences', omit(competences, values.index));
                            setCurrent(undefined);
                          }}
                        >
                          {buttonsTitles.delete}
                        </Button>
                      )}
                      <Button type="submit">{buttonsTitles.save}</Button>
                    </ButtonRow>
                  )}
                </FormRow>
              </Form>
            );
          }}
        </Formik>
      </Popup>
    </Container>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default CoachesCompetences;
