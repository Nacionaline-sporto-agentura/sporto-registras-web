import invert from 'invert-color';
import styled from 'styled-components';
import { TagColors } from '../../../src/utils/constants';

interface StatusTagProps {
  label: string;
  tagColor?: TagColors;
  color?: string;
}

export const statusBackgroundColors = {
  [TagColors.BLUE]: '#EFF8FF',
  [TagColors.BROWN]: '#FFFAEB',
  [TagColors.GREEN]: '#ECFDF3',
  [TagColors.PINK]: '#FDF2FA',
  [TagColors.VIOLET]: '#f4f5fd',
  [TagColors.ORANGE]: '#fff7eb',
  [TagColors.SKYBLUE]: '#eef8fa',
  [TagColors.GREY]: '#F2F4F7',
};

export const statusFontColors = {
  [TagColors.BLUE]: '#175CD3',
  [TagColors.BROWN]: '#B54708',
  [TagColors.GREEN]: '#027A48',
  [TagColors.PINK]: '#C11574',
  [TagColors.VIOLET]: '#6F7DE5',
  [TagColors.ORANGE]: '#FC9C04',
  [TagColors.SKYBLUE]: '#0dc9e6',
  [TagColors.GREY]: '#344054',
};

const StatusTag = ({ label, tagColor, color = statusBackgroundColors.grey }: StatusTagProps) => {
  return (
    <div>
      <Container backgroundColor={tagColor ? statusBackgroundColors[tagColor] : color}>
        <Text color={tagColor ? statusFontColors[tagColor] : invert(color)}>{label}</Text>
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
