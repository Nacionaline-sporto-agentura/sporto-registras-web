import styled from 'styled-components';
import { device } from '../../styles';
import { colorsByStatus } from '../../utils/constants';
import { buttonsTitles, requestStatusLabels } from '../../utils/texts';
import AdditionalButtons from '../buttons/AdditionalButtons';
import BackButton from '../buttons/BackButton';
import Button from '../buttons/Button';
import TabBar from '../Tabs/TabBar';
import InfoRow from './InfoRow';
import StatusTag from './StatusTag';

const RequestFormHeader = ({
  title,
  request,
  showDraftButton,
  disabled,
  handleDraft,
  onSubmit,
  canValidate,
  currentTabIndex,
  onSetCurrentTabIndex,
  onSetStatus,
  tabs,
  back,
  info,
}) => (
  <TitleColumn>
    {!!back ? <BackButton /> : <Line />}
    <Row>
      <InnerRow>
        <Title>{title}</Title>
        {request?.status && (
          <StatusTag
            label={requestStatusLabels[request.status]}
            color={colorsByStatus[request.status]}
          />
        )}
      </InnerRow>
      <InnerRow>
        {showDraftButton && <Button onClick={handleDraft}>{buttonsTitles.saveAsDraft}</Button>}
        {!disabled && <Button onClick={onSubmit}>{buttonsTitles.submit}</Button>}
        {canValidate && <AdditionalButtons handleChange={onSetStatus} />}
      </InnerRow>
    </Row>
    {request && <InfoRow info={info} />}
    <TabBar
      tabs={tabs}
      onClick={onSetCurrentTabIndex}
      isActive={(_, index) => currentTabIndex == index}
    />
  </TitleColumn>
);

const TitleColumn = styled.div`
  display: flex;
  gap: 16px;
  margin: -16px -16px 12px -16px;
  padding: 16px 16px 0 16px;
  flex-direction: column;
  background-color: white;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Line = styled.div`
  height: 1px;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: #121926;
  opacity: 1;
  @media ${device.mobileL} {
    font-size: 2.4rem;
  }
`;

export default RequestFormHeader;
