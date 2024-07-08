import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { Study } from '../../types';
import { StudiesType } from '../../utils/constants';
import {
  formatDate,
  getEducationalCompaniesList,
  getStudyProgramList,
} from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  studiesTypeLabels,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonsGroup';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

const studiesSchema = Yup.object().shape({
  type: Yup.mixed().oneOf(Object.values(StudiesType)),
  company: Yup.object().required(validationTexts.requireSelect),
  program: Yup.object().required(validationTexts.requireSelect),
  startAt: Yup.date().required(validationTexts.requireText),
  endAt: Yup.date().required(validationTexts.requireText),
});

const studiesLabels = {
  company: { label: inputLabels.companyName, show: true },
  program: { label: inputLabels.learningProgram, show: true },
  startAt: { label: inputLabels.startAt, show: true },
  endAt: { label: inputLabels.endAt, show: true },
};

const StudiesContainer = ({ studies = {}, handleChange, disabled }) => {
  const studiesKeys = Object.keys(studies);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<Study>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedStudies = { ...studies, [index]: rest };

      handleChange('studies', updatedStudies);
    } else {
      handleChange('studies', { [generateUniqueString()]: values, ...studies });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: studiesKeys.map((key) => {
      const study = studies?.[key];

      return {
        ...study,
        company: <TableItem label={study?.company?.name} bottomLabel={study?.company?.id} />,
        program: <TableItem label={study?.program?.name} bottomLabel={study?.program?.id} />,
        startAt: formatDate(study?.startAt),
        endAt: formatDate(study?.endAt),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.studies}
        description={descriptions.studies}
        buttonTitle={buttonsTitles.addData}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų mokymosi ir studijų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={studiesLabels}
        onClick={(id) => {
          setCurrent({ ...studies[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addStudies}
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
          validationSchema={studiesSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <ButtonsGroup
                    disabled={disabled}
                    onChange={(value) => setFieldValue('type', value)}
                    label={inputLabels.type}
                    error={errors?.type}
                    options={Object.values(StudiesType)}
                    getOptionLabel={(option) => studiesTypeLabels[option]}
                    isSelected={(options) => options === values.type}
                  />
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.companyNameCode}
                    value={values?.company}
                    error={errors?.company}
                    name="company"
                    onChange={(company) => {
                      setFieldValue(`company`, company);
                      setFieldValue(`program`, undefined);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getEducationalCompaniesList(input, page)}
                  />

                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.programNameCode}
                    value={values?.program}
                    error={errors?.program}
                    dependsOnTheValue={values?.company?.id}
                    name="program"
                    onChange={(program) => {
                      setFieldValue(`program`, program);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page, value) =>
                      getStudyProgramList(input, page, { company: value })
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
                            handleChange('studies', omit(studies, values.index));
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

export default StudiesContainer;
