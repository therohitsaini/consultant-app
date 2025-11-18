import {Button, Frame, Modal, TextContainer} from '@shopify/polaris';
import {useState, useCallback} from 'react';

 export function UserAlert({isUserAlertVisible, setIsUserAlertVisible}) {
  const [active, setActive] = useState(true);

  const handleChange = () => {
    setIsUserAlertVisible(false);
  }


  return (
        <Modal
          activator={true}
          open={isUserAlertVisible}
          onClose={handleChange}
          title="Reach more shoppers with Instagram product tags"
          primaryAction={{
            content: 'Delete Consultant',
            onAction: handleChange,
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
                Use Instagram posts to share your products with millions of
                people. Let shoppers buy from your store without leaving
                Instagram.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
  );
}