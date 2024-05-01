import { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { Photo } from '../../types';
import { handleErrorToast } from '../../utils/functions';
import { inputLabels, validationTexts } from '../../utils/texts';
import { FormItem } from '../other/FormItem';
import FullscreenLoader from '../other/FullscreenLoader';
import Icon, { IconName } from '../other/Icons';
import SimpleContainer from '../other/SimpleContainer';
import TextAreaField from './TextAreaField';

export interface PhotoFielProps {
  photo: Photo;
  handleDelete: (index: string) => void;
  handleSetRepresentative: (index: string) => void;
  disabled?: boolean;
  index: number;
  onChange: (name: string, props: any) => void;
  photoKey: string;
}

const PhotoField = ({
  handleDelete,
  handleSetRepresentative,
  disabled = false,
  photoKey,
  index,
  photo,
  onChange,
}: PhotoFielProps) => {
  const [loading, setLoading] = useState(true);
  const { representative, description, url } = photo;
  const isPublic = photo.public;

  const Additional = (
    <Row>
      <ItemRow onClick={() => handleSetRepresentative(photoKey)}>
        <StyledIcon name={representative ? IconName.image : IconName.imageOff} />
        <IconText>
          {representative ? inputLabels.isRepresentative : inputLabels.makeRepresentative}
        </IconText>
      </ItemRow>
      <ItemRow onClick={() => onChange(`photos.${photoKey}.public`, !isPublic)}>
        <StyledIcon name={isPublic ? IconName.visibleOn : IconName.visibleOff} />
        <IconText>{isPublic ? inputLabels.isPublic : inputLabels.makePublic}</IconText>
      </ItemRow>
    </Row>
  );

  return (
    <SimpleContainer>
      <FormItem
        {...(!disabled && {
          onDelete: () => handleDelete(photoKey),
          title: Additional,
        })}
        key={`photo-${photoKey}`}
      >
        <ContentRow>
          <StyledImg
            onError={() => {
              handleErrorToast(validationTexts.photoNotUploaded);
              setLoading(false);
            }}
            display={!loading}
            disabled={disabled}
            key={index}
            src={url}
            onLoad={() => setLoading(false)}
          />
          <TextAreaField
            disabled={disabled}
            label={inputLabels.description}
            value={description}
            name="name"
            onChange={(input) => onChange(`photos.${photoKey}.description`, input)}
          />
        </ContentRow>
        {loading && (
          <ImageLayer>
            <FullscreenLoader />
          </ImageLayer>
        )}
      </FormItem>
    </SimpleContainer>
  );
};

const StyledIcon = styled(Icon)``;

const IconText = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 16.94px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ItemRow = styled.div`
  display: flex;
  gap: 4px;
  cursor: pointer;
`;

const ImageLayer = styled.div`
  transition: 0.5s ease;
  opacity: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImg = styled.img<{
  disabled: boolean;
  display: boolean;
}>`
  height: 105px;
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
  opacity: 1;
  display: ${({ display }) => (display ? 'block' : 'none')};
  max-width: 100%;
  transition: 0.5s ease;
  backface-visibility: hidden;
  max-width: 100%;
`;

const ContentRow = styled.div<{ columns?: number }>`
  display: grid;
  margin-top: 16px;
  grid-template-columns: 105px 1fr;
  gap: 16px;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

export default PhotoField;
