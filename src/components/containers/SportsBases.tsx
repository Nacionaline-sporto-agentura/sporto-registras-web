import { Form, Formik } from 'formik';
import { isEmpty, omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { SportsBase } from '../../types';
import { getSportBasesList } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelectField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

const sportsBaseSchema = Yup.object().shape({
  id: Yup.number().required(validationTexts.requireSelect),
});

const studiesLabels = {
  sportsBase: { label: inputLabels.sportBaseName, show: true },
};

interface SportBaseForm extends SportsBase {
  index: number;
}

const SportBasesContainer = ({ sportsBases = {}, handleChange, disabled }) => {
  const studiesKeys = Object.keys(sportsBases);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [current, setCurrent] = useState<SportBaseForm>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedSportBase = { ...sportsBases, [index]: rest };

      handleChange('sportsBases', updatedSportBase);
    } else {
      handleChange('sportsBases', { [generateUniqueString()]: values, ...sportsBases });
    }

    setCurrent(undefined);
  };

  const initialValues = current;

  const mappedData = {
    data: studiesKeys.map((key) => {
      const sportBase = sportsBases?.[key];

      return {
        sportsBase: <TableItem label={sportBase?.name} bottomLabel={sportBase?.id} />,
        id: key,
      };
    }),
  };

  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.sportBase}
        description={descriptions.sportBase}
        buttonTitle={buttonsTitles.addSportBase}
        disabled={disabled}
        onCreateNew={() => setCurrent({} as any)}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra paskirtų sporto bazių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={studiesLabels}
        onClick={(id) => {
          setCurrent({ ...sportsBases[id], index: id });
        }}
      />

      <Popup
        title={buttonsTitles.addSportBase}
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
          validationSchema={sportsBaseSchema}
        >
          {({ values, errors, setValues }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <AsyncSelectField
                    disabled={disabled}
                    label={inputLabels.companyNameCode}
                    value={isEmpty(values) ? undefined : values}
                    error={errors?.id}
                    name="sportsBases"
                    onChange={(sportBase) => {
                      setValues(sportBase);
                    }}
                    getOptionLabel={(option) => option?.name}
                    loadOptions={(input, page) =>
                      getSportBasesList(input, page, {
                        id: {
                          $nin: Object.values(sportsBases || {}).map(
                            (sportBase: any) => sportBase?.id,
                          ),
                        },
                      })
                    }
                  />

                  {!disabled && (
                    <ButtonRow>
                      {values?.index && (
                        <Button
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('sportsBases', omit(sportsBases, values.index));
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

export default SportBasesContainer;
