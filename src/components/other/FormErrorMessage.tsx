import { isEmpty } from 'lodash';
import styled from 'styled-components';

export const FormErrorMessage = ({ errors }: { errors?: any }) => {
  if (isEmpty(errors)) return <></>;

  return <ErrorMessage>{'Užpildykite formą teisingai'}</ErrorMessage>;
};

const ErrorMessage = styled.div`
  margin-top: 12px;
  background-color: #ffedf0;
  color: #fe1d42;
  border: 1px solid #fe1d42;
  border-radius: 4px;
  padding: 5px 0 5px 16px;
  display: flex;
  align-items: center;
`;
