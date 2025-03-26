import { Box, Input, InputGroup, InputLeftElement, List, ListItem, Avatar, Flex, Text } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useFollow } from "../context/FollowContext";

const SearchBar = () => {
  const { AlgoliaSearch, results, query, setQuery } = useFollow();

  const showResults = query.length > 1 && results.length > 0;

  return (
    <Box position="relative" width="48%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search..."
          borderRadius="full"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "blue.500" }}
          onChange={(e) => {
            setQuery(e.target.value);
            AlgoliaSearch();
          }}
        />
      </InputGroup>
      {showResults && (
        <Box
          position="absolute"
          zIndex="popover"
          width="full"
          maxH="60vh"
          overflowY="auto"
          mt="2"
          boxShadow="lg"
          borderRadius="md"
          bg="gray.800"
          border="1px"
          borderColor="gray.700"
          animation="fadeIn 0.3s ease-out"
        >
          <List spacing={2}>
            {results.map((result) => (
              <ListItem key={result.username} _hover={{ background: "gray.700" }}>
                <Link to={`/profile/${result.username}`} style={{ textDecoration: "none" }}>
                  <Flex alignItems="center">
                    <Avatar src={result.avatarUrl} name={result.firstname} size="sm" marginRight="2" />
                    <Box>
                      <strong>{result.username}</strong>
                      <Text color="gray.300" ml="2">
                        {result.firstName} {result.lastName}
                      </Text>
                    </Box>
                  </Flex>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
