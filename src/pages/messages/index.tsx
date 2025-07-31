import { Flex, Icon, VStack, Text, Box, Input, Avatar } from "@chakra-ui/react";
import { AvatarName } from "../../components/AvatarName";
import Division from "../../components/Division";
import { BiSearchAlt } from "react-icons/bi";
import Header from "../../components/Header";
import { MdSend } from "react-icons/md";
import { useSession } from "next-auth/react";

export default function Messages() {
  const { data } = useSession();
  return (
    <Flex h="100vh" mt="-50px" pt="50px" justifyContent="flex-start">
      <Flex id="left-nav" flexDir="column">
        <AvatarName
          avatar={data?.user.image}
          email={data?.user.email}
          name={data?.user.name}
        />
        <Division width={"100%"} bg={"#323232"} />
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Text ml="20px">Mensagens</Text>
        </Flex>
        <Division width={"100%"} bg={"#323232"} />

        <Flex
          alignItems="center"
          h="29px"
          w="90%"
          borderRadius="5px"
          bg="#0B0B0B"
          alignSelf="center"
          color="#BEBEBE"
          position="relative"
          mr="12px"
          as="label"
        >
          <Input
            h="29px"
            bg="transparent"
            w="90%"
            border="none"
            focusBorderColor="none"
            name={"search"}
          />
          <Icon
            position="absolute"
            right="2"
            zIndex="2"
            as={BiSearchAlt}
            _hover={{
              cursor: "pointer",
            }}
            fontSize="20"
          />
        </Flex>

        <Division width={"100%"} bg={"#323232"} />

        <VStack>
          <Flex cursor="pointer" mb=".5rem" h="36px" width="90%">
            <Avatar w="36px" h="36px" />
            <Flex ml="18px" flexDir="column">
              <Text fontSize="14px">Yinuo Chen</Text>
              <Text fontSize="10px"> Lorem epsium</Text>
            </Flex>
            <Text fontSize="12px" mt="2px" ml="auto" mr="12px">
              03/10/2022
            </Text>
          </Flex>
          <Division width={"100%"} bg={"#323232"} />
        </VStack>
      </Flex>
      <Box height="100%" m="auto 0 0 16px" w={"1px"} bg="#323232" />
      <Flex flexDir="column">
        <Flex flexDir="column">
          <Text
            bg="#383838"
            color="#FFEB80"
            borderRadius="0 7px 7px 7px"
            fontSize="14px"
            ml="1rem"
            mt="1rem"
            p=".5rem"
            marginRight="auto"
            maxWidth="70%"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text
            bg="#383838"
            color="#ffffff"
            borderRadius="7px 0px 7px 7px"
            fontSize="14px"
            ml="auto"
            mt="1rem"
            p=".5rem"
            marginRight="1rem"
            maxWidth="70%"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Text>
        </Flex>
        <Flex alignItems="center" bg="#323232" p="0.5rem" mt="auto">
          <Input border="none" fontSize="16px" ml="1rem" bg="#0B0B0B" />
          <Icon m="auto 1rem" color="#969696" fontSize="30px" as={MdSend} />
        </Flex>
      </Flex>
    </Flex>
  );
}
