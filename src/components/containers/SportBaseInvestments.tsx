import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import { FormRow } from '../../styles/CommonStyles';
import { Investment, Source } from '../../types';
import { formatDate, getSportBaseSourcesList } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import SimpleButton from '../buttons/SimpleButton';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import TextAreaField from '../fields/TextAreaField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import Icon, { IconName } from '../other/Icons';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

interface InvestmentForm extends Investment {
  index: number;
}

const investmentsSchema = Yup.object().shape({
  items: Yup.lazy((_, ctx) => {
    const users = ctx?.context?.items;
    return Yup.object().shape(
      Object.keys(users).reduce((obj, key) => {
        obj[key] = Yup.object().shape({
          source: Yup.object().required(validationTexts.requireText),
          fundsAmount: Yup.string().required(validationTexts.requireText),
        });
        return obj;
      }, {}),
    );
  }),
  improvements: Yup.string().required(validationTexts.requireText),
  appointedAt: Yup.date().required(validationTexts.requireText),
});

const investmentsLabels = {
  source: { label: inputLabels.investmentSources, show: true },
  fundsAmount: { label: inputLabels.totalFundsAmount, show: true },
  appointedAt: { label: inputLabels.appointedAt, show: true },
};

const InvestmentsContainer = ({ investments, handleChange, disabled }) => {
  const investmentKeys = Object.keys(investments);
  const [validateOnChange, setValidateOnChange] = useState(false);

  const [current, setCurrent] = useState<InvestmentForm | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedInvestments = { ...investments, [index]: rest };

      handleChange('investments', updatedInvestments);
    } else {
      handleChange('investments', { [generateUniqueString()]: values, ...investments });
    }
    setValidateOnChange(false);
    setCurrent(undefined);
  };

  const initialItems = {
    source: undefined,
    fundsAmount: '',
  };

  const initialValues: any = current || {};

  const mappedData = {
    data: investmentKeys.map((key) => {
      const items = investments?.[key]?.items;
      const itemsKeys = Object.keys(items);
      const source = itemsKeys.reduce((str, curr, index) => {
        const name = items[curr]?.source?.name;
        return str + (name ? (index === 0 ? name : ', ' + name) : '');
      }, '');

      const fundsAmount = itemsKeys.reduce((total, curr) => {
        return total + (Number(items[curr]?.fundsAmount) || 0);
      }, 0);

      return {
        ...investments[key],
        source: source,
        fundsAmount,
        appointedAt: formatDate(investments?.[key]?.appointedAt),
        id: key,
      };
    }),
  };
  return (
    <>
      <InnerContainerRow
        title={pageTitles.investments}
        description={descriptions.investments}
        buttonTitle={buttonsTitles.addInvestment}
        disabled={disabled}
        onCreateNew={() => setCurrent({ items: { [generateUniqueString()]: initialItems } })}
      />

      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų investicijų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={investmentsLabels}
        onClick={(id) => {
          setCurrent({ ...investments[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addInvestment}
        visible={!!current}
        onClose={() => setCurrent(undefined)}
      >
        <Formik
          validateOnChange={validateOnChange}
          enableReinitialize={false}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={() => {
            setValidateOnChange(true);
          }}
          validationSchema={investmentsSchema}
        >
          {({ values, errors, setFieldValue }) => {
            const items = values?.items;
            const itemsKeys = Object.keys(items);
            const selectedIds = (itemsKeys || [])?.map((key) => items[key]?.source?.id);

            return (
              <Form>
                <FormRow columns={1}>
                  <div>
                    {itemsKeys?.map((key) => {
                      const error: any = errors?.items?.[key];
                      const item = items[key];
                      return (
                        <SourcesRow key={`items-${key}`}>
                          <AsyncSelectField
                            disabled={disabled}
                            label={inputLabels.investmentSources}
                            value={item?.source}
                            showError={false}
                            error={error?.source}
                            name="source"
                            onChange={(source: Source) => {
                              setFieldValue(`items.${key}.source`, source);
                            }}
                            getOptionLabel={(option) => option?.name}
                            loadOptions={(input, page) =>
                              getSportBaseSourcesList(input, page, { id: { $nin: selectedIds } })
                            }
                          />
                          <NumericTextField
                            disabled={disabled}
                            label={inputLabels.fundsAmount}
                            value={item?.fundsAmount}
                            showError={false}
                            error={error?.fundsAmount}
                            onChange={(e: string) => {
                              setFieldValue(`items.${key}.fundsAmount`, e);
                            }}
                          />
                          {!disabled && itemsKeys.length > 1 && (
                            <DeleteButton onClick={() => setFieldValue('items', omit(items, key))}>
                              <DeleteIcon name={IconName.deleteItem} />
                            </DeleteButton>
                          )}
                        </SourcesRow>
                      );
                    })}
                    {!disabled && (
                      <SimpleButton
                        onClick={() => {
                          setFieldValue('items', {
                            ...items,
                            [generateUniqueString()]: initialItems,
                          });
                        }}
                      >
                        {buttonsTitles.addInvestmentSource}
                      </SimpleButton>
                    )}
                  </div>

                  <TextAreaField
                    disabled={disabled}
                    label={inputLabels.improvements}
                    error={errors?.improvements}
                    value={values?.improvements}
                    name="improvements"
                    onChange={(input) => setFieldValue(`improvements`, input)}
                  />

                  <DateField
                    disabled={disabled}
                    label={inputLabels.appointedAt}
                    value={values?.appointedAt}
                    error={errors?.appointedAt}
                    onChange={(appointedAt) => setFieldValue(`appointedAt`, appointedAt)}
                  />
                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          disabled={disabled}
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('investments', omit(investments, values.index));
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

const SourcesRow = styled.div`
  display: grid;
  align-items: center;
  margin-top: 16px;
  grid-template-columns: 1fr 1fr;

  & > *:nth-child(3n) {
    grid-column: 3 / span 1;
  }
  gap: 16px;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

const DeleteButton = styled.div`
  margin-top: auto;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  @media ${device.mobileL} {
    margin-bottom: 0px;
    height: auto;
  }
`;

const DeleteIcon = styled(Icon)`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error};
  font-size: 2.4rem;
  margin: auto 0 auto 0px;
  @media ${device.mobileL} {
    margin: 8px 0 16px 0;
  }
`;

export default InvestmentsContainer;
