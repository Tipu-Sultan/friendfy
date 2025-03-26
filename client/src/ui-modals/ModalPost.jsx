import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  Box,
  Flex,
  Textarea,
  IconButton,
  InputGroup,
  Text
} from "@chakra-ui/react";
import { CloseIcon, AttachmentIcon } from "@chakra-ui/icons";
import { usePost } from "../context/PostContext";

const ModalPost = () => {
  const { 
    setCheckEditPost,
    setEditPost, editPost, 
    checkEditPost, isModalOpen,
    handleCloseModal, loading, 
    selectedFile, handleFileChange, 
    handlePost, postText, setPostText } = usePost();

  const cancelFile = () => {
    if (typeof handleFileChange === "function") {
      handleFileChange({ target: { files: [] } });
    }
    setCheckEditPost(false);
    setEditPost(null)
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= 300) {
      setPostText(newText);
    }
  };


  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center">
              <Textarea
                placeholder="What's on your mind?"
                mb="2"
                resize="none"
                minH="100px"
                value={postText || editPost?.content}
                onChange={handleTextChange}
              />
              {!checkEditPost && <InputGroup mb="4">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  display="none"
                  id="fileInput"
                />
                <label htmlFor="fileInput">
                  <IconButton
                    as="span"
                    icon={<AttachmentIcon />}
                    aria-label="Attach File"
                    cursor="pointer"
                  />
                </label>
              </InputGroup>}

              {(selectedFile || checkEditPost) && (
                <Box mt="2" position="relative">
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="Cancel File"
                    onClick={cancelFile}
                    position="absolute"
                    top="0"
                    right="0"
                    zIndex="1"
                  />
                  {(selectedFile?.type?.startsWith("image/") || editPost?.contentType?.split("/")[0] === 'image') ? (
                    <Image
                      src={selectedFile ? URL.createObjectURL(selectedFile) : checkEditPost && editPost?.media}
                      alt="Preview"
                      maxH="200px"
                    />
                  ) : (
                    <video width="100%" height="200" controls>
                      <source
                        src={selectedFile ? URL.createObjectURL(selectedFile) : checkEditPost && editPost?.media}
                        type={selectedFile?.type || (checkEditPost && editPost?.contentType)}
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </Box>
              )}

            </Flex>
          </ModalBody>

          <ModalFooter>
            <Text color="gray.500" mr="auto">
              {postText.length || editPost?.content.length}/300
            </Text>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handlePost(postText)}
              isDisabled={postText.length === 0}
              isLoading={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalPost;
