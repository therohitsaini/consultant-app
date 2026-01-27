import { Button, Frame, Modal, TextContainer } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export function UserAlert({ isUserAlertVisible, setIsUserAlertVisible, handleDelete, consultantId }) {

  const handleChange = () => {
    setIsUserAlertVisible(false);
  }



  return (
    <Modal
      activator={true}
      open={isUserAlertVisible}
      onClose={handleChange}
      title="Delete Consultant"
      primaryAction={{
        content: 'Delete Consultant',
        onAction: () => handleDelete(consultantId),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            Are you sure you want to delete this consultant?
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}
export function UserAlertVoucher({ isUserAlertVisible, setIsUserAlertVisible, handleDelete, voucherId }) {

  const handleChange = () => {
    setIsUserAlertVisible(false);
  }



  return (
    <Modal
      activator={true}
      open={isUserAlertVisible}
      onClose={handleChange}
      title="Delete Voucher"
      primaryAction={{
        content: 'Delete Voucher',
        onAction: () => handleDelete(voucherId),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            Are you sure you want to delete this voucher?
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}