import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, IconButton, Textarea, Input, InputGroup, Box, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons"; // Import the CloseIcon component
import { useStory } from "../context/StoryContext";
import { AttachmentIcon } from "@chakra-ui/icons";

const StoryModal = ({ isOpen, onClose }) => {
  const {textData,wait,selectedFile,setSelectedFile,setTtextData, contentType, handleSubmit, handleContentTypeChange } = useStory();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleResetFile = () => {
    setSelectedFile(null);
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type.split("/")[0];

    if (fileType === "image") {
      return <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: "100%" }} />;
    } else if (fileType === "video") {
      return <video src={URL.createObjectURL(selectedFile)} controls style={{ maxWidth: "100%" }} />;
    } else if (fileType === "audio") {
      return <audio src={URL.createObjectURL(selectedFile)} controls />;
    } else {
      return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Story</ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "1rem" }}>
            {/* Text Button */}
            <Button size="md" onClick={() => handleContentTypeChange("text")} mr={2}>Text</Button>
            {/* Paperclip Icon */}
            <InputGroup>
              <Input
                type="file"
                onChange={handleFileInputChange}
                display="none"
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <IconButton
                  as="span"
                  icon={<AttachmentIcon />}
                  aria-label="Attach File"
                  cursor="pointer"
                  size="md"
                  onClick={() => handleContentTypeChange("file")}
                />
              </label>
            </InputGroup>
          </div>

          {/* Content creation interface based on the selected type */}
          {contentType === "text" ? <Textarea onChange={(e)=>setTtextData(e.target.value)} placeholder="Type your message" /> : null}
          {contentType === "file" && selectedFile ? (
            <Box mt={2}>
              <Box position="relative">
                <IconButton
                  icon={<CloseIcon />}
                  aria-label="Reset File"
                  variant="ghost"
                  onClick={handleResetFile}
                  position="absolute"
                  top="-8px"
                  right="-8px"
                />
                {renderFilePreview()}
              </Box>
            </Box>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button isLoading={wait} isDisabled={textData?.length<=0 || !contentType} colorScheme="blue" mr={3} onClick={handleSubmit} size="md">
            Post Story
          </Button>
          <Button onClick={onClose} size="md">Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StoryModal;
