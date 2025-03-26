import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useFollow } from "../context/FollowContext";

const DeleteFollowModal = ({rid}) => {
    const {handleCloseModal,isModalOpen,handleFollow} = useFollow();
  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to unfollow this Account?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>handleFollow(rid,'Delete')}>
              Unfollow {rid}
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const DeleteUserModal= () => {
  const {handleCloseModal,isModalOpen,handleDeleteUser} = useAuth();
return (
  <div>
    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to delete this Account?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDeleteUser}>
            Delete
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </div>
);
};

export  {DeleteUserModal,DeleteFollowModal};
