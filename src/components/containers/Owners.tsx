import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow } from '../../styles/CommonStyles';
import { Source, SportBase } from '../../types';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

const ownersSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  companyCode: Yup.string().required(validationTexts.requireText),
  website: Yup.string().required(validationTexts.requireText),
});

const ownersLabels = {
  name: { label: inputLabels.jarName, show: true },
  companyCode: { label: inputLabels.jarCode, show: true },
  website: { label: inputLabels.website, show: true },
};

const OwnersContainer = ({ owners = {}, handleChange, disabled }) => {
  const ownerKeys = Object.keys(owners);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<SportBase['owners'] | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedOwners = { ...owners, [index]: rest };

      handleChange('owners', updatedOwners);
    } else {
      handleChange('owners', { [generateUniqueString()]: values, ...owners });
    }

    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  return (
    <>
      <InnerContainerRow
        title={pageTitles.owners}
        description={descriptions.owners}
        buttonTitle={buttonsTitles.addOwner}
        disabled={disabled}
        onCreateNew={() => setCurrent({})}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų savininkų' }}
        isFilterApplied={false}
        data={{ data: ownerKeys.map((key) => ({ ...owners[key], id: key })) }}
        hidePagination={true}
        columns={ownersLabels}
        onClick={(id) => {
          setCurrent({ ...owners[id], index: id });
        }}
      />

      <Popup title={formLabels.addOwner} visible={!!current} onClose={() => setCurrent(undefined)}>
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          validate={() => {
            setValidateOnChange(true);
          }}
          onSubmit={onSubmit}
          validationSchema={ownersSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <TextField
                    disabled={disabled}
                    label={inputLabels.jarName}
                    value={values?.name}
                    error={errors?.name}
                    name="name"
                    onChange={(source: Source) => {
                      setFieldValue(`name`, source);
                    }}
                  />
                  <TextField
                    disabled={disabled}
                    label={inputLabels.jarCode}
                    value={values?.companyCode}
                    error={errors?.companyCode}
                    name="companyCode"
                    onChange={(companyCode: string) => {
                      setFieldValue(`companyCode`, companyCode);
                    }}
                  />
                  <UrlField
                    disabled={disabled}
                    label={inputLabels.website}
                    value={values?.website}
                    error={errors?.website}
                    onChange={(endAt) => setFieldValue(`website`, endAt)}
                  />
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('owners', omit(owners, values.index));
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

const Title = styled.div`
  font-size: 2rem;
  line-height: 25px;
  font-weight: bold;
  color: #231f20;
  margin-right: 16px;
`;

export default OwnersContainer;
