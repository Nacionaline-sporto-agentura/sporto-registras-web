import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { FileProps, Photo } from '../../types';
import api from '../../utils/api';
import { handleErrorToast } from '../../utils/functions';
import { validationTexts } from '../../utils/texts';
import Icon, { IconName } from '../other/Icons';
import Loader from '../other/Loader';
import FieldWrapper from './components/FieldWrapper';
import PhotoField from './PhotoField';

export const availableMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export const validateFileTypes = (files: File[]) => {
  for (let i = 0; i < files.length; i++) {
    const availableType = availableMimeTypes.find((type) => type === files[i].type);
    if (!availableType) return false;
  }
  return true;
};

export interface PhotoUploadFieldProps {
  name: string;
  photos: Photo[];
  onChange: (name: string, props: any) => void;
  disabled?: boolean;
  canOpenPhoto?: boolean;
  error?: string;
  showError?: boolean;
}

const PhotoUploadField = ({
  photos = [],
  name,
  disabled = false,
  onChange,
  error,
  showError = true,
}: PhotoUploadFieldProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = (index) => {
    onChange('photos', [...photos?.slice(0, index), ...photos?.slice(index + 1)]);
  };

  const handleSetIsRepresentative = (currIndex) => {
    onChange(
      'photos',
      photos.map((photo, index) => ({ ...photo, representative: currIndex === index })),
    );
  };

  const handleUpload = async (newPhotos: File[]) => {
    const files = await api.uploadFiles(newPhotos);
    onChange('photos', [
      ...photos,
      ...files.map(({ name, ...rest }) => ({ ...rest, description: name })),
    ]);
  };

  const handleSetFiles = async (photos: File[]) => {
    const isValidFileTypes = validateFileTypes(photos);
    if (!isValidFileTypes) return handleErrorToast(validationTexts.badFileTypes);
    setLoading(true);
    await handleUpload(photos);
    setLoading(false);
  };

  return (
    <FieldWrapper error={error} showError={showError}>
      <Container>
        {photos.map((photo: FileProps | any, index: number) => {
          if (!photo) return <></>;

          return (
            <React.Fragment key={index + 'photo'}>
              <PhotoField
                handleSetRepresentative={handleSetIsRepresentative}
                photo={photo}
                disabled={disabled}
                handleDelete={handleDelete}
                index={index}
                onChange={onChange}
              />
            </React.Fragment>
          );
        })}

        {loading && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}

        {!disabled && (
          <UploadFieldContainer error={!!error}>
            <UploadFieldInnerContainer>
              <ButtonIcon>
                <StyledIcon name={IconName.addPhoto} />
              </ButtonIcon>
            </UploadFieldInnerContainer>
            <StyledInput
              disabled={disabled}
              value={undefined}
              multiple={true}
              type="file"
              accept="image/*"
              name={name}
              onChange={(e: any) => {
                const files: File[] = Array.from(e?.target?.files);
                if (isEmpty(files)) return;

                handleSetFiles(files);
              }}
            />
          </UploadFieldContainer>
        )}
      </Container>
    </FieldWrapper>
  );
};

const LoaderContainer = styled.div`
  height: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadFieldInnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const StyledInput = styled.input``;

const ButtonIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadFieldContainer = styled.div<{
  error: boolean;
}>`
  border-width: 1px;
  border-color: ${({ error }) => (error ? 'red' : '#CDD5DF')};
  border-style: dashed;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  position: relative;
  background-color: white;
  input {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0;
    width: 100%;
    height: 36px;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.4rem;
  color: #b55007;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export default PhotoUploadField;
