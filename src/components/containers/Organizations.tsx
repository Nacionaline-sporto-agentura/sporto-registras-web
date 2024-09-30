import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow } from '../../styles/CommonStyles';
import { SportsBase } from '../../types';
import { formatDate, getOrganizationBasisList } from '../../utils/functions';
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
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

const organizationsSchema = Yup.object().shape({
  companyName: Yup.string().required(validationTexts.requireText),
  basis: Yup.object().required(validationTexts.requireText),
  startAt: Yup.date().required(validationTexts.requireText),
  endAt: Yup.date().nullable().notRequired(),
});

const organizationsLabels = {
  companyName: { label: inputLabels.name, show: true },
  startAt: { label: inputLabels.startAt, show: true },
  endAt: { label: inputLabels.endAt, show: true },
  basis: { label: inputLabels.basis, show: true },
};

const OrganizationsContainer = ({ organizations, handleChange, disabled }) => {
  const organizationKeys = Object.keys(organizations);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<SportsBase['tenants'] | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedOrganizations = { ...organizations, [index]: rest };

      handleChange('tenants', updatedOrganizations);
    } else {
      handleChange('tenants', { [generateUniqueString()]: values, ...organizations });
    }
    setValidateOnChange(false);
    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  const mappedData = {
    data: organizationKeys.map((key) => {
      const organization = organizations?.[key];

      return {
        ...organizations[key],
        basis: organization?.basis?.name,
        startAt: formatDate(organization?.startAt),
        endAt: formatDate(organization?.endAt),
        id: key,
      };
    }),
  };

  return (
    <>
      <InnerContainerRow
        title={pageTitles.organizations}
        description={descriptions.organizations}
        buttonTitle={buttonsTitles.addOrganization}
        disabled={disabled}
        onCreateNew={() => setCurrent({})}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų organizacijų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={organizationsLabels}
        onClick={(id) => {
          setCurrent({ ...organizations[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addSportOrganization}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={onSubmit}
          validationSchema={organizationsSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <TextField
                    disabled={disabled}
                    label={inputLabels.name}
                    value={values?.companyName}
                    error={errors?.companyName}
                    name="name"
                    onChange={(name: string) => {
                      setFieldValue(`companyName`, name);
                    }}
                  />
                  <TextField
                    disabled={disabled}
                    label={inputLabels.companyCode}
                    value={values?.companyCode}
                    error={errors?.companyCode}
                    name="name"
                    onChange={(companyCode: string) => {
                      setFieldValue(`companyCode`, companyCode);
                    }}
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
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.organizationBasis}
                    value={values?.basis}
                    error={errors?.basis}
                    name="basis"
                    onChange={(basis) => {
                      setFieldValue(`basis`, basis);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) => getOrganizationBasisList(input, page)}
                  />
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('tenants', omit(organizations, values.index));
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
    </>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

export default OrganizationsContainer;
