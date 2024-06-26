import React, { useEffect } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
interface ModalProps {
  visible: boolean;
  onClose?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal = ({ visible, children, onClose }: ModalProps) => {
  const handleCloseOnEscape = (event) => {
    if (event.key === 'Escape') {
      onClose && onClose(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleCloseOnEscape);
    return () => window.removeEventListener('keydown', handleCloseOnEscape);
  }, [visible]);

  if (!visible) {
    return <React.Fragment />;
  }

  return <ModalContainer>{children}</ModalContainer>;
};

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  background-color: #0b1b607a;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  overflow-y: auto;
  padding: 16px;
  @media ${device.mobileL} {
    padding: 0px;
  }
`;

export default Modal;
