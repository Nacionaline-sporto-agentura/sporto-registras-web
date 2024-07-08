import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { FaSpecialist } from '../../types';
import { formatDate, getFullName, getSportsPersonList } from '../../utils/functions';
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

interface FaInstructorFaSpecialistForm extends FaSpecialist {
  index: string;
}

const refereeCategorySchema = Yup.object().shape({
  faSpecialist: Yup.object().required(validationTexts.requireText),
  dateFrom: Yup.date().required(validationTexts.requireText),
  dateTo: Yup.date().required(validationTexts.requireText),
});

const refereeCategoryLabels = {
  faSpecialist: { label: inputLabels.faSpecialist, show: true },
  dateFrom: { label: inputLabels.startAt, show: true },
  dateTo: { label: inputLabels.endAt, show: true },
};

const FaInstructorSpecialistsContainer = ({ specialists = {}, handleChange, disabled }) => {
  const specialistsKeys = Object.keys(specialists);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<FaInstructorFaSpecialistForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedSpecialists = { ...specialists, [index]: rest };

      handleChange('faInstructor.faSpecialists', updatedSpecialists);
    } else {
      handleChange('faInstructor.faSpecialists', {
        [generateUniqueString()]: values,
        ...specialists,
      });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: specialistsKeys.map((key) => {
      const category: FaSpecialist = specialists?.[key];

      return {
        ...category,
        faSpecialist: getFullName(category?.faSpecialist),
        dateFrom: formatDate(category?.dateFrom),
        dateTo: formatDate(category?.dateTo),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.faSpecialist}
        description={descriptions.faSpecialist}
        buttonTitle={buttonsTitles.addFaSpecialist}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų FA specialistų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={refereeCategoryLabels}
        onClick={(id) => {
          setCurrent({ ...specialists[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addFaSpecialist}
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
          validationSchema={refereeCategorySchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.faSpecialist}
                    value={values?.faSpecialist}
                    error={errors?.faSpecialist}
                    name="faSpecialist"
                    onChange={(sportsPerson) => {
                      setFieldValue(`faSpecialist`, sportsPerson);
                    }}
                    getOptionLabel={(option) => getFullName(option)}
                    loadOptions={(input, page) =>
                      getSportsPersonList(input, page, { faSpecialist: { $exists: true } })
                    }
                  />
                </FormRow>
                <FormRow columns={2}>
                  <DateField
                    disabled={disabled}
                    name={'startAt'}
                    label={inputLabels.startAt}
                    value={values?.dateFrom}
                    error={errors?.dateFrom}
                    maxDate={values?.dateTo}
                    onChange={(startAt) => setFieldValue(`dateFrom`, startAt)}
                  />
                  <DateField
                    disabled={disabled}
                    name={'endAt'}
                    label={inputLabels.endAt}
                    value={values?.dateTo}
                    minDate={values?.dateFrom}
                    error={errors?.dateTo}
                    onChange={(endAt) => setFieldValue(`dateTo`, endAt)}
                  />
                </FormRow>
                <FormRow columns={1}>
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange(
                              'faInstructor.faSpecialists',
                              omit(specialists, values.index),
                            );
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

export default FaInstructorSpecialistsContainer;
