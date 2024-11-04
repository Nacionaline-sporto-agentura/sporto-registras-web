import invert from 'invert-color';
import styled from 'styled-components';
import { TagColors } from '../../../src/utils/constants';

interface StatusTagProps {
  label: string;
  tagColor?: TagColors;
  color?: string;
}

export const statusColors = {
  [TagColors.BLUE]: '#175CD3',
  [TagColors.BROWN]: '#B54708',
  [TagColors.GREEN]: '#027A48',
  [TagColors.PINK]: '#C11574',
  [TagColors.VIOLET]: '#6F7DE5',
  [TagColors.ORANGE]: '#FC9C04',
  [TagColors.SKYBLUE]: '#0dc9e6',
  [TagColors.GREY]: '#344054',
};

const StatusTag = ({ label, tagColor, color = statusColors.grey }: StatusTagProps) => {
  return (
    <div>
      <Container backgroundColor={tagColor ? `${statusColors[tagColor]}0f` : `${color}0f`}>
        <Text color={tagColor ? statusColors[tagColor] : color}>{label}</Text>
      </Container>
    </div>
  );
};

const Container = styled.div<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 50px;
  padding: 8px 12px;
  width: fit-content;
`;

const Text = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 1.4rem;
  line-height: 14px;
`;

export default StatusTag;
