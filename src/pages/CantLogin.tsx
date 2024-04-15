import styled from "styled-components";
import ReturnToLogin from "../components/other/ReturnToLogin";
import { device } from "../styles";
import { descriptions, formLabels } from "../utils/texts";

export const CantLogin = () => {
  return (
    <>
      <H1>{formLabels.inActiveProfile}</H1>
      <Description>{descriptions.cantLogin} </Description>
      <ReturnToLogin />
    </>
  );
};

const Description = styled.div`
  font-size: 1.6rem;
  letter-spacing: 0px;
  color: #7a7e9f;
  margin-bottom: 40px;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const H1 = styled.h1`
  font-weight: bold;
  font-size: 3.2rem;
  line-height: 22px;
  letter-spacing: 0px;
  margin-top: 40px;

  @media ${device.mobileL} {
    padding-bottom: 0px;
  }
`;
