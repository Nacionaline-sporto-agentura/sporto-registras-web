import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import { FormRow } from '../../styles/CommonStyles';
import { TenantMembership } from '../../types';
import { MembershipTypes } from '../../utils/constants';
import { formatDate } from '../../utils/functions';
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels,
  membershipTypeLabels,
  membershipTypeTableLabels,
  pageTitles,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import DateField from '../fields/DateField';
import RadioOptions from '../fields/RadioOptions';
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import Icon from '../other/Icons';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

interface TenantMembershipForm extends TenantMembership {
  index: number;
}

const membershipSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  //companyCode: Yup.string().required(validationTexts.requireText),
  startAt: Yup.date().required(validationTexts.requireText),
});

const membershipTableLabels = {
  name: { label: inputLabels.organizationName, show: true },
  companyCode: { label: inputLabels.companyCode, show: true },
  type: { label: inputLabels.membershipType, show: true },
  startAt: { label: inputLabels.membershipStart, show: true },
  endAt: { label: inputLabels.membershipEnd, show: true },
};

const TenantMembershipsContainer = ({
  memberships = {},
  handleChange,
  disabled,
}: {
  memberships: { [key: string]: TenantMembership };
  handleChange: any;
  disabled: boolean;
}) => {
  const membershipsKeys = Object.keys(memberships);
  const [validateOnChange, setValidateOnChange] = useState(false);

  const [current, setCurrent] = useState<TenantMembershipForm | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedGoverningBodies = { ...memberships, [index]: rest };

      handleChange('memberships', updatedGoverningBodies);
    } else {
      handleChange('memberships', { [generateUniqueString()]: values, ...memberships });
    }
    setValidateOnChange(false);
    setCurrent(undefined);
  };

  const initialValues: any = current || {};

  const mappedData = {
    data: membershipsKeys.map((key) => {
      const membership = memberships?.[key];

      return {
        ...membership,
        type: membershipTypeTableLabels[membership.type],
        startAt: formatDate(membership?.startAt),
        endAt: formatDate(membership?.endAt),
        id: key,
      };
    }),
  };

  const options = Object.keys(MembershipTypes);

  return (
    <>
      <InnerContainerRow
        title={pageTitles.memberships}
        description={descriptions.memberships}
        buttonTitle={buttonsTitles.addMembership}
        disabled={disabled}
        onCreateNew={() => setCurrent({})}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų narysčių' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={membershipTableLabels}
        onClick={(id) => {
          setCurrent({ ...memberships[id], index: id });
        }}
      />
      <Popup
        title={formLabels.addMembership}
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
          validationSchema={membershipSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <Form>
                <FormRow columns={1}>
                  <RadioOptions
                    value={values?.type}
                    options={options}
                    getOptionLabel={(option) => membershipTypeLabels[option]}
                    label={inputLabels.membershipType}
                    column
                    onChange={(type) => {
                      setFieldValue('type', type);
                    }}
                  />

                  <TextField
                    disabled={disabled}
                    label={inputLabels.organizationName}
                    error={errors?.name}
                    value={values.name}
                    name="name"
                    onChange={(input) => setFieldValue(`name`, input)}
                  />

                  {values?.type === MembershipTypes.LITHUANIAN && (
                    <TextField
                      disabled={disabled}
                      label={inputLabels.companyCode}
                      error={errors?.companyCode}
                      value={values.companyCode}
                      name="companyCode"
                      onChange={(input) => setFieldValue(`companyCode`, input)}
                    />
                  )}

                  <FormRow columns={2}>
                    <DateField
                      disabled={disabled}
                      name={'startAt'}
                      label={inputLabels.membershipStart}
                      value={values?.startAt}
                      maxDate={values?.endAt}
                      error={errors?.startAt}
                      onChange={(startAt) => setFieldValue(`startAt`, startAt)}
                    />
                    <DateField
                      disabled={disabled}
                      name={'endAt'}
                      label={inputLabels.membershipEnd}
                      value={values?.endAt}
                      minDate={values?.startAt}
                      error={errors?.endAt}
                      onChange={(endAt) => setFieldValue(`endAt`, endAt)}
                    />
                  </FormRow>

                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          disabled={disabled}
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('investments', omit(memberships, values.index));
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

const UsersRow = styled.div`
  display: grid;
  align-items: center;
  margin-top: 16px;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  & > *:nth-child(5n) {
    grid-column: 5 / span 1;
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

export default TenantMembershipsContainer;
