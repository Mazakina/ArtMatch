import { FormControl, Text, Button, Flex } from "@chakra-ui/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaArtstation, FaBehanceSquare } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { Api } from "../../../services/api";
import SocialOptions from "../SocialOptions";

interface SocialSec {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  settingOpt: string;
  userSettings: {
    data: {
      social: {
        instagram: string;
        artstation: string;
        behance: string;
        telefone: string;
      };
    };
  };
  user: {
    name: string;
    image: string;
    email: string;
  };
}

export default function SocialSec({
  isLoading,
  setIsLoading,
  settingOpt,
  userSettings,
  user,
}: SocialSec) {
  const [artstation, setArtstation] = useState(
    userSettings.data.social?.artstation
  );
  const [telefone, setTelefone] = useState(userSettings.data.social?.telefone);
  const [instagram, setInstagram] = useState(
    userSettings.data.social?.instagram
  );
  const [behance, setBehance] = useState(userSettings.data.social?.behance);
  const saveSettingsSocial = (event: FormEvent) => {
    event.preventDefault();
    const requestData = {
      section: "social",
      instagram: instagram,
      artstation: artstation,
      behance: behance,
      telefone: telefone,
      user: {
        ...user,
        email: {
          email: user.email
        }
      },
    };
    Api.post("/_lib/userSettings/saveUserSettings", requestData)
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <FormControl
      as={Flex}
      display={settingOpt == "social" ? "initial" : "none"}
      flexDir="column"
      w={{ base: "90%", lg: "60%" }}
      m={{ base: "0 auto", lg: " 0 0 0 40px" }}
      maxWidth="690px"
      id="config-content"
    >
      <Text mb="10px" fontSize="26px">
        Social
      </Text>
      <Flex
        bg="#121212"
        mt="1rem"
        pb="1rem"
        border="1px
        solid
        #959595"
        flexDir="column"
        w="100%"
        alignItems="center"
        justifyContent="center"
      >
        <SocialOptions
          onChange={setInstagram}
          icon={AiOutlineInstagram}
          placeholder={"Ex: @Fabiano"}
          text="Instagram"
          value={instagram}
        />
        <SocialOptions
          onChange={setArtstation}
          icon={FaArtstation}
          text="Artstation"
          placeholder="seu usuário do Artstation"
          value={artstation}
        />
        <SocialOptions
          onChange={setBehance}
          icon={FaBehanceSquare}
          text="BeHance"
          placeholder="seu usuário do Behance"
          value={behance}
        />
        <SocialOptions
          onChange={setTelefone}
          icon={FiPhone}
          text="Telefone"
          placeholder="Ex: (11) 99999-9999"
          value={telefone}
        />
      </Flex>
      <Button
        mt="2rem"
        bg="none"
        w="140px"
        border="1px solid #FFEB80"
        color="#FFEB80"
        borderRadius="2px"
        _hover={{
          bg: "none",
        }}
        ml="auto"
        aria-label="salvar"
        isLoading={isLoading}
        onClick={(event) => {
          saveSettingsSocial(event);
        }}
      >
        Salvar
      </Button>
    </FormControl>
  );
}
