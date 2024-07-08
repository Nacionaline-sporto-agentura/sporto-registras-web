import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { AmsInstructor } from '../../types';
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

interface FaInstructorFaSpecialistForm extends AmsInstructor {
  index: string;
}

const refereeCategorySchema = Yup.object().shape({
  coach: Yup.object().required(validationTexts.requireText),
  startAt: Yup.date().required(validationTexts.requireText),
  endAt: Yup.date().required(validationTexts.requireText),
});

const labels = {
  coach: { label: inputLabels.coach, show: true },
  startAt: { label: inputLabels.startAt, show: true },
  endAt: { label: inputLabels.endAt, show: true },
};

const AmsInstructorCoachesContainer = ({ coaches = {}, handleChange, disabled }) => {
  const coachKeys = Object.keys(coaches);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<FaInstructorFaSpecialistForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedSpecialists = { ...coaches, [index]: rest };

      handleChange('amsInstructor.coaches', updatedSpecialists);
    } else {
      handleChange('amsInstructor.coaches', {
        [generateUniqueString()]: values,
        ...coaches,
      });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: coachKeys.map((key) => {
      const coach: FaInstructorFaSpecialistForm = coaches?.[key];

      return {
        ...coach,
        coach: getFullName(coach?.coach),
        startAt: formatDate(coach?.startAt),
        endAt: formatDate(coach?.endAt),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.coaches}
        description={descriptions.amsCoaches}
        buttonTitle={buttonsTitles.addCoach}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų trenerių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={labels}
        onClick={(id) => {
          setCurrent({ ...coaches[id], index: id });
        }}
      />

      <Popup title={formLabels.addCoach} visible={!!current} onClose={() => setCurrent(undefined)}>
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
                    label={inputLabels.amsInstructorCoach}
                    value={values?.coach}
                    error={errors?.coach}
                    name="coach"
                    onChange={(sportsPerson) => {
                      setFieldValue(`coach`, sportsPerson);
                    }}
                    getOptionLabel={(option) => getFullName(option)}
                    loadOptions={(input, page) =>
                      getSportsPersonList(input, page, { coach: { $exists: true } })
                    }
                  />
                </FormRow>
                <FormRow columns={2}>
                  <DateField
                    disabled={disabled}
                    name={'startAt'}
                    label={inputLabels.startAt}
                    value={values?.startAt}
                    maxDate={values?.endAt}
                    error={errors?.startAt}
                    onChange={(startAt) => setFieldValue(`startAt`, startAt)}
                  />
                  <DateField
                    disabled={disabled}
                    name={'endAt'}
                    label={inputLabels.endAt}
                    value={values?.endAt}
                    minDate={values?.startAt}
                    error={errors?.endAt}
                    onChange={(endAt) => setFieldValue(`endAt`, endAt)}
                  />
                </FormRow>
                <FormRow columns={1}>
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('amsInstructor.coaches', omit(coaches, values.index));
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

export default AmsInstructorCoachesContainer;
