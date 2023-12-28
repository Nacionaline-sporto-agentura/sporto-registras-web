import { isEmpty, map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Icon from './Icons';

export interface BreadcrumbsProps {
  items?: { id: string; name: string }[];
  className?: string;
  homeName: string;
  homeRoute: string;
  pathRoute: (id: string) => string;
}

const Breadcrumbs = ({ items, className, homeName, homeRoute, pathRoute }: BreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <>
      {!isEmpty(items) && (
        <Container className={className}>
          <Row>
            <Url
              onClick={() => {
                navigate(homeRoute);
              }}
            >
              {homeName}
            </Url>
            <StyledIcons name="forward"></StyledIcons>
          </Row>

          {map(items, (group, index) => {
            if (!items) return;

            return (
              <Row key={`bread_crumb-${index}`}>
                <Url
                  onClick={() => {
                    navigate(pathRoute(group.id));
                  }}
                >
                  {group.name}
                </Url>
                {items?.length - 1 !== index && <StyledIcons name="forward"></StyledIcons>}
              </Row>
            );
          })}
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  gap: 13px;
  margin-top: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 13px;
`;

const Url = styled.div`
  font-size: 1.2rem;
  letter-spacing: 0.29px;
  color: #4b5565;
  cursor: pointer;
`;

const StyledIcons = styled(Icon)`
  color: #cdd5df;
`;

export default Breadcrumbs;
