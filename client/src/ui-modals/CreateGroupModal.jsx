import { Button, Checkbox, CheckboxGroup, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react'
import React from 'react'
import { useChats } from '../context/ChatsContext';

const CreateGroupModal = ({isOpen,onClose}) => {
    const {
        handleCreateGroup,userList,groupName, setGroupName,selectedMembers, setSelectedMembers
    } = useChats();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Group</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        mb={4}
                    />
                    <CheckboxGroup value={selectedMembers} onChange={setSelectedMembers}>
                        <VStack align="start">
                            {userList.map((user) => (
                                <Checkbox key={user.id} value={user._id}>
                                    {user.firstname} {user.lastname}
                                </Checkbox>
                            ))}
                        </VStack>
                    </CheckboxGroup>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleCreateGroup}>
                        Create
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateGroupModal