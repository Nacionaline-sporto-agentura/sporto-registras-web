import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import { FormRow } from '../../styles/CommonStyles';
import { GoverningBody } from '../../types';
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
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import Popup from '../layouts/Popup';
import Icon, { IconName } from '../other/Icons';
import InnerContainerRow from '../other/InnerContainerRow';
import MainTable from '../tables/MainTable';

interface GoverningBodyForm extends GoverningBody {
  index: number;
}

const governingBodySchema = Yup.object().shape({
  users: Yup.lazy((_, ctx) => {
    const users = ctx?.context?.users;

    return Yup.object().shape(
      Object.keys(users).reduce((obj, key) => {
        obj[key] = Yup.object().shape(
          Object.keys(users[key]).reduce((innerObj, innerKey) => {
            innerObj[innerKey] = Yup.string().required(validationTexts.requireText);
            return innerObj;
          }, {}),
        );
        return obj;
      }, {}),
    );
  }),
  name: Yup.string().required(validationTexts.requireText),
});

const governingBodyLabels = {
  name: { label: inputLabels.governingBodyName, show: true },
  usersCount: { label: inputLabels.membersCount, show: true },
};

const GoverningBodiesContainer = ({
  governingBodies = {},
  handleChange,
  disabled,
}: {
  governingBodies: { [key: string]: GoverningBody };
  handleChange: any;
  disabled: boolean;
}) => {
  const governingBodyKeys = Object.keys(governingBodies);
  const [validateOnChange, setValidateOnChange] = useState(false);

  const [current, setCurrent] = useState<GoverningBodyForm | {}>();

  const onSubmit = async (values: any) => {
    if (typeof values?.index !== 'undefined') {
      const { index, ...rest } = values;

      const updatedGoverningBodies = { ...governingBodies, [index]: rest };

      handleChange('governingBodies', updatedGoverningBodies);
    } else {
      handleChange('governingBodies', { [generateUniqueString()]: values, ...governingBodies });
    }
    setValidateOnChange(false);
    setCurrent(undefined);
  };

  const initialUser = {
    firstName: '',
    lastName: '',
    position: '',
    personalCode: '',
  };

  const initialValues: any = current || {};

  const mappedData = {
    data: governingBodyKeys.map((key) => {
      const governingBody = governingBodies?.[key];

      return {
        name: governingBody?.name,
        usersCount: Object.keys(governingBody?.users).length,
        id: key,
      };
    }),
  };

  return (
    <>
      <InnerContainerRow
        title={pageTitles.governingBodies}
        description={descriptions.governingBodies}
        buttonTitle={buttonsTitles.addGoverningBody}
        disabled={disabled}
        onCreateNew={() => setCurrent({ users: { [generateUniqueString()]: initialUser } })}
      />

      <MainTable
        notFoundInfo={{ text: 'Nėra sukurtų valdymo organų' }}
        isFilterApplied={false}
        data={mappedData}
        hidePagination={true}
        columns={governingBodyLabels}
        onClick={(id) => {
          setCurrent({ ...governingBodies[id], index: id });
        }}
      />

      <Popup
        title={formLabels.addGoverningBody}
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
          validationSchema={governingBodySchema}
        >
          {({ values, errors, setFieldValue }) => {
            const users = values?.users;
            const usersKeys = Object.keys(users);
            return (
              <Form>
                <TextField
                  disabled={disabled}
                  label={inputLabels.governingBodyName}
                  error={errors?.name}
                  value={values.name}
                  name="name"
                  onChange={(input) => setFieldValue(`name`, input)}
                />

                <FormRow columns={1}>
                  <div>
                    {usersKeys?.map((key) => {
                      const error: any = errors?.users?.[key];
                      const item = users[key];
                      return (
                        <UsersRow key={`governingBodyUsers-${key}`}>
                          <TextField
                            disabled={disabled}
                            label={inputLabels.firstName}
                            error={error?.firstName}
                            value={item.firstName}
                            showError={false}
                            name="firstName"
                            onChange={(input) => setFieldValue(`users.${key}.firstName`, input)}
                          />
                          <TextField
                            disabled={disabled}
                            label={inputLabels.lastName}
                            error={error?.lastName}
                            value={item.lastName}
                            showError={false}
                            name="lastName"
                            onChange={(input) => setFieldValue(`users.${key}.lastName`, input)}
                          />
                          <TextField
                            disabled={disabled}
                            label={inputLabels.position}
                            error={error?.position}
                            value={item.position}
                            showError={false}
                            name="position"
                            onChange={(input) => setFieldValue(`users.${key}.position`, input)}
                          />
                          <TextField
                            disabled={disabled}
                            label={inputLabels.personalCode}
                            error={error?.personalCode}
                            value={item.personalCode}
                            showError={false}
                            name="personalCode"
                            onChange={(input) => setFieldValue(`users.${key}.personalCode`, input)}
                          />

                          {!disabled && usersKeys.length > 1 && (
                            <DeleteButton onClick={() => setFieldValue('users', omit(users, key))}>
                              <DeleteIcon name={IconName.deleteItem} />
                            </DeleteButton>
                          )}
                        </UsersRow>
                      );
                    })}
                    {!disabled && (
                      <SimpleButton
                        onClick={() => {
                          setFieldValue('users', {
                            ...users,
                            [generateUniqueString()]: initialUser,
                          });
                        }}
                      >
                        {buttonsTitles.addBodyMember}
                      </SimpleButton>
                    )}
                  </div>

                  {!disabled && (
                    <ButtonRow>
                      {values.index && (
                        <Button
                          disabled={disabled}
                          variant={ButtonColors.DANGER}
                          onClick={() => {
                            handleChange('investments', omit(governingBodies, values.index));
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

export default GoverningBodiesContainer;
