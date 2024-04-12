import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { sportBaseTabTitles } from '../../pages/SportBase';
import { FormRow, TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { Source, SportBase } from '../../types';
import { buttonsTitles, formLabels, inputLabels, validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';

const ownersSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  code: Yup.string().required(validationTexts.requireText),
  website: Yup.string().required(validationTexts.requireText),
});

const ownersLabels = {
  name: { label: inputLabels.jarName, show: true },
  code: { label: inputLabels.code, show: true },
  website: { label: inputLabels.website, show: true },
};

const OwnersContainer = ({ owners, handleChange, counter, setCounter, disabled }) => {
  const ownerKeys = Object.keys(owners);

  const [current, setCurrent] = useState<SportBase['owners'] | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedOwners = { ...owners, [index]: rest };

      handleChange('owners', updatedOwners);
    } else {
      handleChange('owners', { [counter]: values, ...owners });
      setCounter(setCounter + 1);
    }

    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <Title>{sportBaseTabTitles.owners}</Title>
        </TableButtonsInnerRow>
        <Button disabled={disabled} onClick={() => setCurrent({})}>
          {buttonsTitles.addOwner}
        </Button>
      </TableButtonsRow>
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

      <Popup
        title={formLabels.infoAboutOwner}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={false}
          enableReinitialize={false}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={ownersSchema}
        >
          {({ values, errors, setFieldValue }) => {
            console.log(errors, 'errors');
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
                    label={inputLabels.code}
                    value={values?.code}
                    error={errors?.code}
                    name="code"
                    onChange={(source: Source) => {
                      setFieldValue(`code`, source);
                    }}
                  />
                  <UrlField
                    disabled={disabled}
                    label={inputLabels.website}
                    value={values?.website}
                    error={errors?.website}
                    onChange={(endAt) => setFieldValue(`website`, endAt)}
                  />
                  <ButtonRow>
                    {values.index && (
                      <Button
                        disabled={disabled}
                        variant={ButtonColors.DANGER}
                        onClick={() => {
                          handleChange('owners', omit(owners, values.index));
                          setCurrent(undefined);
                        }}
                      >
                        {buttonsTitles.delete}
                      </Button>
                    )}
                    <Button disabled={disabled} type="submit">
                      {buttonsTitles.save}
                    </Button>
                  </ButtonRow>
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
