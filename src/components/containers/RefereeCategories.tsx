import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { RefereeCategory } from '../../types';
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
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

interface RefereeCategoryForm extends RefereeCategory {
  index: string;
}

const refereeCategorySchema = Yup.object().shape({
  company: Yup.object().required(validationTexts.requireSelect),
  series: Yup.string().required(validationTexts.requireText),
  documentNumber: Yup.string().required(validationTexts.requireText),
  formCode: Yup.string().required(validationTexts.requireText),
  issuedAt: Yup.date().required(validationTexts.requireText),
});

const refereeCategoryLabels = {
  company: { label: inputLabels.companyName, show: true },
  documentNumber: { label: inputLabels.documentNo, show: true },
  series: { label: inputLabels.series, show: true },
  formCode: { label: inputLabels.formCode, show: true },
  issuedAt: { label: inputLabels.issued, show: true },
};

const RefereeCategoriesContainer = ({ categories = {}, handleChange, disabled }) => {
  const categoryKeys = Object.keys(categories);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<RefereeCategoryForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedCategories = { ...categories, [index]: rest };

      handleChange('referee.categories', updatedCategories);
    } else {
      handleChange('referee.categories', { [generateUniqueString()]: values, ...categories });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: categoryKeys.map((key) => {
      const category = categories?.[key];

      return {
        ...category,
        company: <TableItem label={category?.company?.name} bottomLabel={category?.company?.id} />,
        formCode: category?.formCode,
        series: category?.series,
        documentNumber: category?.documentNumber,
        issuedAt: formatDate(category?.issuedAt),
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.categories}
        description={descriptions.categories}
        buttonTitle={buttonsTitles.addCategory}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų kategorijų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={refereeCategoryLabels}
        onClick={(id) => {
          setCurrent({ ...categories[id], index: id });
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
          validationSchema={refereeCategorySchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.sportsOrganization}
                    value={values?.company}
                    error={errors?.company}
                    name="company"
                    onChange={(basis) => {
                      setFieldValue(`company`, basis);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getEducationalCompaniesList(input, page)}
                  />
                </FormRow>
                <FormRow columns={2}>
                  <NumericTextField
                    disabled={disabled}
                    name={'documentNumber'}
                    label={inputLabels.documentNo}
                    value={values?.documentNumber}
                    error={errors?.documentNumber}
                    onChange={(endAt) => setFieldValue(`documentNumber`, endAt)}
                  />
                  <TextField
                    disabled={disabled}
                    name={'formCode'}
                    label={inputLabels.formCode}
                    value={values?.formCode}
                    error={errors?.formCode}
                    onChange={(endAt) => setFieldValue(`formCode`, endAt)}
                  />

                  <TextField
                    disabled={disabled}
                    name={'series'}
                    label={inputLabels.series}
                    value={values?.series}
                    error={errors?.series}
                    onChange={(endAt) => setFieldValue(`series`, endAt)}
                  />
                  <DateField
                    disabled={disabled}
                    name={'endAt'}
                    label={inputLabels.issuedDate}
                    value={values?.issuedAt}
                    error={errors?.issuedAt}
                    onChange={(endAt) => setFieldValue(`issuedAt`, endAt)}
                  />
                </FormRow>
                <FormRow columns={1}>
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('referee.categories', omit(categories, values.index));
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

export default RefereeCategoriesContainer;
