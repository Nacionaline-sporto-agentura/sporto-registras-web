import * as Yup from 'yup';
import { validationTexts } from '../utils/texts';
import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';
import { companyCode, personalCode } from 'lt-codes';

const validateOwnerForm = Yup.object().shape({
  firstName: Yup.string().when(['showOwnerForm'], (items, schema) => {
    if (items[0]) {
      return schema
        .required(validationTexts.requireText)
        .test('validFirstName', validationTexts.validFirstName, (values) => {
          if (/\d/.test(values || '')) return false;

          return true;
        });
    }
    return schema.nullable();
  }),
  lastName: Yup.string().when(['showOwnerForm'], (items, schema) => {
    if (items[0]) {
      return schema
        .required(validationTexts.requireText)
        .test('validLastName', validationTexts.validLastName, (values) => {
          if (/\d/.test(values || '')) return false;

          return true;
        });
    }
    return schema.nullable();
  }),
  phone: Yup.string().when(['showOwnerForm'], (items, schema) => {
    if (items[0]) {
      return schema
        .required(validationTexts.requireText)
        .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat);
    }
    return schema.nullable();
  }),
  personalCode: Yup.string().when(['ownerWithPassword', 'showOwnerForm'], (items: any, schema) => {
    if (!items[0] && items[1]) {
      return schema
        .required(validationTexts.requireText)
        .trim()
        .test('validatePersonalCode', validationTexts.personalCode, (value) => {
          return personalCode.validate(value).isValid;
        });
    }

    return schema.nullable();
  }),
  email: Yup.string().when(['showOwnerForm'], (items, schema) => {
    if (items[0]) {
      return schema.required(validationTexts.requireText).email(validationTexts.badEmailFormat);
    }
    return schema.nullable();
  }),
});

const validateInstitutionForm = Yup.object().shape({
  companyName: Yup.string().required(validationTexts.requireText).trim(),
  companyCode: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validateCompanyCode', validationTexts.companyCode, (value) => {
      return companyCode.validate(value).isValid;
    }),
  companyPhone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
  companyEmail: Yup.string()
    .email(validationTexts.badEmailFormat)
    .required(validationTexts.requireText),
});

export const combinedInstitutionValidationSchema =
  validateInstitutionForm.concat(validateOwnerForm);
