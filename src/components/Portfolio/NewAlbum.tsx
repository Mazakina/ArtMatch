import { Spinner, Flex, Icon, Input } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Api } from "../../services/api";
import { BsCheckLg } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

interface AlbumsProps {
  id: string;
  title: string;
}

interface NewAlbumProps {
  albumsCollection: Array<AlbumsProps>;
  setAlbumsCollection: Dispatch<SetStateAction<Array<AlbumsProps>>>;
  data: any;
  setIsCreatingNewAlbum: Dispatch<SetStateAction<boolean>>;
}

export function NewAlbum({
  albumsCollection,
  setAlbumsCollection,
  data,
  setIsCreatingNewAlbum,
}: NewAlbumProps) {
  const albumNameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsloading] = useState(false);
  function cancel() {
    albumNameRef.current.value = "";
    setIsCreatingNewAlbum(false);
  }
  async function createAlbum() {
    const albumName = albumNameRef.current.value;
    if (albumName) {
      setIsloading(true);
      await Api.post("/_lib/imgur/manageAlbum", {
        ...data,
        albumRef: "",
        albumName: albumName,
        action: "create",
      }).then((response) =>
        setAlbumsCollection([...albumsCollection, response.data])
      );
      setIsCreatingNewAlbum(false);
      setIsloading(false);
      albumNameRef.current.value = "";
    }
  }
  const handleKeyUp = (event) => {
    if (event?.key === "Escape") {
      cancel();
    }
  };
  const handleKeyPress = (event) => {
    if (event?.key === "Enter") {
      createAlbum();
    }
  };
  return (
    <Flex
      _hover={{ zIndex: 11, bg: "#20343d78", border: "1px solid #FCD635" }}
      border={"1px solid #FCD635"}
      data-tooltip-content="Arraste para Adicionar"
      cursor={"pointer"}
      ml={0}
      w="100%"
      maxW={"250px"}
      mr="auto"
      borderRadius="5px"
      flexDir="column"
      alignItems="center"
    >
      <Flex flexDir="row" alignItems="center" w="100%">
        <Flex onClick={() => {}} w="100%" p=".2rem 16px  " alignItems="center">
          <Input
            autoFocus
            id="newAlbumInput"
            onKeyUp={(event) => {
              handleKeyUp(event);
            }}
            onKeyPress={(e) => handleKeyPress(e)}
            disabled={isLoading}
            ref={albumNameRef}
            padding={0}
            m={0}
            h="1.5rem"
            border={"none"}
            _selected={{ border: "none" }}
            fontSize={"1rem"}
            aria-label="nome do álbum"
            type="text"
          />
          {isLoading ? <Spinner size="sm" /> : ""}
        </Flex>
        {!isLoading ? (
          <>
            <Icon
              onClick={() => {
                createAlbum();
              }}
              mr=".5rem"
              fontSize={"1rem"}
              _hover={{ color: "#FCD635" }}
              color={"#959595"}
              as={BsCheckLg}
            />
            <Icon
              onClick={() => {
                cancel();
              }}
              mr=".5rem"
              fontSize={"1.3rem"}
              _hover={{ color: "#FCD635" }}
              color={"#959595"}
              as={IoClose}
            />
          </>
        ) : (
          ""
        )}
      </Flex>
    </Flex>
  );
}
