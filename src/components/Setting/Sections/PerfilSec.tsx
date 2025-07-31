import {
  Avatar,
  Image,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Icon,
  Input,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FormEvent, useCallback, useState } from "react";
import { AiFillEdit, AiOutlineEdit } from "react-icons/ai";
import { Api } from "../../../services/api";
import Division from "../../Division";
import SkillsTagSection from "../SkillsTagSection";
import Compress from "compress.js";
import { useDropzone } from "react-dropzone";
import ModalTag from "../ModalTag";
import { useQuery } from "react-query";
import GoogleAutoComplete from "../GoogleAutoComplete";

interface PerfilSec {
  settingOpt: string;
  userSettings: {
    data: {
      profile: {
        usuario: string;
        biografia: string;
        habilidades: Array<string>;
        cidade: string;
        endereco: string;
        avatar: string;
        avatarDeleteHash: string;
        banner: string;
        bannerDeleteHash: string;
      };
    };
  };
  user: any;
}

export default function PerfilSec({
  settingOpt,
  userSettings,
  user,
}: PerfilSec) {
  const [usuario, setUsuario] = useState(userSettings.data.profile?.usuario);
  const [biografia, setBiografia] = useState(
    userSettings.data.profile?.biografia
  );
  const [habilidades, setHabilidades] = useState(
    userSettings.data.profile?.habilidades
  );
  const [cidade, setCidade] = useState(userSettings.data.profile?.cidade);
  const [endereco, setEndereco] = useState<any>(
    userSettings.data.profile?.endereco
  );
  const [avatar, setAvatar] = useState<any>(userSettings.data.profile?.avatar);
  const [avatarDeleteHash] = useState<any>(
    userSettings.data.profile?.avatarDeleteHash
  );
  const [banner, setBanner] = useState<any>(userSettings.data.profile?.banner);
  const [bannerDeleteHash] = useState<any>(
    userSettings.data.profile?.bannerDeleteHash
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const compress = new Compress();
  const regex = /^[a-zA-Z0-9\s]*$/;

  const { isLoading: queryIsLoading, data } = useQuery(
    "skills",
    async () => {
      const response = await Api.get("/_lib/userSettings/getSkillsOptions");
      return response;
    },
    { enabled: !!user }
  );

  let skillList = data?.data;
  function valueNeedsUpdate(value, current) {
    if (userSettings.data.profile[value] !== current) {
      return current;
    } else {
      return null;
    }
  }

  async function handleChange(e) {
    let resizedImage = await compress.compress([e.target.files[0]], {
      size: 2,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      resize: true,
    });
    const img = resizedImage[0];
    const base64str = img.data;
    const imgExt = img.ext;
    const resizedFile = Compress.convertBase64ToFile(base64str, imgExt);
    const reader = new FileReader();

    reader.onload = (onLoadEvent) => {
      setAvatar(onLoadEvent.target.result);
    };
    reader.readAsDataURL(resizedFile);
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = function (onLoadEvent) {
      setBanner(onLoadEvent.target.result);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const saveSettingsProfile = (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();

    const requestData = {
      section: "profile",
      usuario: usuario.replace(/\s+/g, " ").toLowerCase(),
      biografia: biografia,
      habilidades: habilidades,
      cidade: cidade,
      endereco: endereco,
      banner: valueNeedsUpdate("banner", banner),
      bannerDeleteHash: bannerDeleteHash,
      avatar: valueNeedsUpdate("avatar", avatar),
      avatarDeleteHash: avatarDeleteHash,
      user: user,
    };
    Api.post("/_lib/userSettings/saveUserSettings", requestData)
      .then(() => setIsLoading(false))
      .catch((err) => {
        if (err.response.data.message === "usuario já existente") {
          alert(err.response.data.message);
        }
        setIsLoading(false);
      });
  };

  return (
    <>
      <FormControl
        display={settingOpt == "perfil" ? "initial" : "none"}
        as={Flex}
        flexDir="column"
        w={{ base: "90%", lg: "60%" }}
        m={{ base: "0 auto", lg: " 0 0 0 40px" }}
        maxWidth="690px"
        id="config-content"
      >
        <Text mb="10px" fontSize="26px">
          Perfil
        </Text>
        <Flex
          bg="#55555514"
          borderRadius="5px"
          border="1px
          solid
          #959595"
          p="21px"
          w="100%"
          flexDir="column"
          id="left-nav"
        >
          <Flex
            flexDir={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
          >
            <Text w={{ base: "fit-content", md: "20%" }} maxWidth="130px">
              Usuário
            </Text>
            <Input
              h="28px"
              aria-label="editar nome de usuário"
              borderRadius="2px"
              border={`1px solid white !important`}
              maxWidth={{ base: "100%", md: "490px" }}
              onChange={(e) => {
                if (regex.test(e.target.value)) {
                  setUsuario(e.target.value);
                }
              }}
              value={usuario}
            />
          </Flex>
          <Flex
            flexDir={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
            mt="1rem"
          >
            <Text w={{ base: "fit-content", md: "20%" }} maxWidth="130px">
              Biografia
            </Text>
            <Textarea
              aria-label="editar sua Biografia"
              h="28px"
              border={`1px solid white  !important`}
              borderRadius="2px"
              maxWidth={{ base: "100%", md: "490px" }}
              onChange={(e) => {
                setBiografia(e.target.value);
              }}
              value={biografia}
            ></Textarea>
          </Flex>

          <Flex
            mt="1rem"
            w="100%"
            flexDir={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
          >
            <Flex
              width={{ base: "100%", md: "80%" }}
              justifyContent="center"
              flexDir="column"
            >
              <Flex
                flexDir={{ base: "column", md: "row" }}
                alignItems={{ base: "flex-start", md: "center" }}
              >
                <Text width="130px">Cidade</Text>
                <Input
                  aria-label="editar sua cidade"
                  h="28px"
                  borderRadius="2px"
                  border={`1px solid white !important`}
                  maxWidth={{ base: "100%", md: "340px" }}
                  onChange={(e) => {
                    setCidade(e.target.value);
                  }}
                  value={cidade}
                ></Input>
              </Flex>
              <Flex
                maxWidth={{ base: "100%", md: "480px" }}
                w="100%"
                mt="1rem"
                flexDir={{ base: "column", md: "row" }}
                alignItems={{ base: "flex-start", md: "center" }}
              >
                <Text width="130px">Endereço</Text>
                <GoogleAutoComplete
                  address={endereco}
                  setEndereco={setEndereco}
                />
              </Flex>
            </Flex>
            <label style={{ margin: "1rem auto 0" }} htmlFor="file-input">
              <Flex
                cursor={"pointer"}
                as={motion.div}
                whileTap={{ scale: 0.95 }}
                h="70px"
                width="70px"
                borderRadius={"50%"}
              >
                <Avatar
                  aria-label="seu avatar"
                  position="absolute"
                  mr="2rem !important"
                  h="70px"
                  width="70px"
                  src={avatar}
                />
                <Flex
                  transition="all 1 ease-in-out"
                  alignItems="center"
                  justifyContent="center"
                  opacity={{ base: ".9", md: "0" }}
                  _hover={{ opacity: "1", bg: "#636363" }}
                  color={"white"}
                  transform={"scale(0.9)"}
                  border="2px solid white"
                  backdropFilter={"blur(2px)"}
                  position="absolute"
                  borderRadius={"50%"}
                  h="70px"
                  width="70px"
                >
                  <Icon p="auto" w="35px" h="35px" as={AiFillEdit} />
                </Flex>
              </Flex>
            </label>
            <input
              aria-label="adicionar novo avatar"
              accept="image/png, image/gif, image/jpeg"
              id="file-input"
              type="file"
              onChange={(e) => handleChange(e)}
              style={{ display: "none" }}
            />
          </Flex>
        </Flex>
        <Flex
          mt="1rem"
          border="1px
          solid
          #959595"
          flexDir="column"
          w="100%"
          h="fit-content"
          alignItems="flex-start"
          bg="#55555514"
          borderRadius={"5px"}
        >
          <Flex
            p="1rem 1rem 0"
            alignItems="center"
            justifyContent={"space-between"}
            w="100%"
          >
            <Text>Habilidades</Text>
            <Icon
              onClick={onOpen}
              aria-label="editar secçao de habilidades"
              cursor={"pointer"}
              _hover={{ color: "#FFEB80", border: "1px solid #FFEB80" }}
              fontSize={"1.9rem"}
              p=".2rem"
              borderRadius={"5px"}
              border="1px  solid #6e6e6e"
              as={AiOutlineEdit}
            />
          </Flex>
          <Division width="100%" bg="#6e6e6e" />
          <Flex mb="1rem">
            <SkillsTagSection skillList={skillList} habilidades={habilidades} />
          </Flex>
        </Flex>
        <Flex
          {...getRootProps()}
          mt="1rem"
          border="1px
        solid
        #959595"
          flexDir="column"
          w="100%"
          h="200px"
          alignItems="center"
          justifyContent="center"
          position={"relative"}
          overflow="hidden"
          cursor={"pointer"}
        >
          <Image
            h="100%"
            src={banner}
            backgroundSize={"cover"}
            backgroundPosition="center"
            backgroundRepeat={"no-repeat"}
            objectFit={"cover"}
            _hover={{ filter: "brightness(0.8)" }}
            position={"absolute"}
            filter="blur(2px) brightness(0.3)"
          />
          <input
            {...getInputProps()}
            id="banner-img"
            aria-label="escolha uma imagem para o Banner"
          />
          {isDragActive ? (
            <Text m="1rem" zIndex={2}>
              Escolha uma imagem para seu Banner
            </Text>
          ) : (
            <Text m="1rem" zIndex={2}>
              Arraste uma Imagem para seu Banner ou clique aqui para escolher
            </Text>
          )}
        </Flex>

        <Button
          onClick={(event) => {
            saveSettingsProfile(event);
          }}
          type="submit"
          mt="2rem"
          bg="none"
          w="140px"
          border="1px solid #FFEB80"
          color="#FFEB80"
          borderRadius="2px"
          aria-label="salvar"
          _hover={{
            bg: "none",
          }}
          ml="auto"
          isLoading={isLoading}
        >
          Salvar
        </Button>
      </FormControl>
      <ModalTag
        isOpen={isOpen}
        onClose={onClose}
        skillList={skillList}
        habilidades={habilidades}
        setHabilidades={setHabilidades}
      />
    </>
  );
}
