import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button, { ButtonColors } from '../buttons/Button';
import Icon from '../other/Icons';

interface PageWrapperProps {
  children: any;
  title: string;
  buttons?: JSX.Element | null;
  back?: boolean;
  className?: string;
}

const TablePageLayout = ({
  children,
  title,
  buttons,
  className,
  back = false,
}: PageWrapperProps) => {
  const navigate = useNavigate();

  return (
    <Container className={className}>
      {back && (
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
          leftIcon={<StyledBackIcon name="back" />}
          variant={ButtonColors.TRANSPARENT}
          type="button"
          height={32}
          buttonPadding="6px 8px"
          color="black"
        >
          {'Grįžti atgal'}
        </BackButton>
      )}
      <Row>
        <Title>{title}</Title>
        {buttons}
      </Row>
      <>{children}</>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 20px 20px 20px;
`;

const Title = styled.div`
  font-size: 2rem;
  line-height: 25px;
  font-weight: bold;
  color: #231f20;
  margin-right: 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 22px 0px 33px 0px;
`;

const BackButton = styled(Button)`
  min-width: 0px;
  margin-top: 20px;
  width: fit-content;
  button {
    padding-right: 16px;
    border: none;
    font-size: 1.6rem;
    color: #121926;
  }
`;

const StyledBackIcon = styled(Icon)`
  cursor: pointer;
  margin-right: 4px;
  font-size: 2rem;
  align-self: center;
  color: #000000;
`;

export default TablePageLayout;
