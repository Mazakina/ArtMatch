import { Flex, Text, Image, Link, Spinner } from "@chakra-ui/react";
import { useContext, useState } from "react";
import Header from "../../components/Header";
import { UserContext } from "../../services/hooks/UserContext";
import { useQuery } from "react-query";
import { Api } from "../../services/api";
import PostPrev from "../../components/PostPrev";
import UserPrev from "../../components/UserPrev";
import Head from "next/head";

export default function Favorites({}) {
  const useUser = useContext(UserContext);
  const { user, favoritePosts, favoriteUsers } = useUser;
  async function getFavoritePosts() {
    let response = await Api.get("/_lib/imgur/imgurGetAllFeed");
    let favoritePostsData = [];
    let favoriteUsersData = [];
    function pushFavoritePosts(postArray) {
      postArray.map((client) => {
        client.posts.map((post) => {
          if (favoritePosts.includes(post.id)) {
            const PostResponse = {
              ...post,
              banner: client.user.banner,
              avatar: client.user.avatar,
              user: client.user.user,
            };
            favoritePostsData.push(PostResponse);
          }
        });
      });
    }
    function pushFavoriteUsers(userArray) {
      userArray.map((client) => {
        if (favoriteUsers.includes(client.user.ref)) {
          favoriteUsersData.push(client);
        }
      });
    }
    pushFavoriteUsers(response.data);
    pushFavoritePosts(response.data);

    const data = { favoritePostsData, favoriteUsersData };
    return data;
  }
  const { isLoading, data, error, isFetched } = useQuery(
    "favoritePosts",
    getFavoritePosts,
    { enabled: !!favoritePosts[0] || !!favoriteUsers[0] }
  );
  const [isCurrentActive, setIsCurrentActive] = useState("Posts");
  return (
    <Flex
      mb="2rem"
      position={"unset"}
      zIndex="1"
      flexDir="column"
      justifyContent="center"
      w="100%"
    >
      <Head>
        <title>Ink Trail | Favoritos </title>
      </Head>
      <Image
        alt="banner do usuário"
        zIndex="1"
        objectFit="cover"
        src={user.data?.banner ? user.data.banner : "images/banner.jpg"}
        width="100%"
        height={{ base: "300px", md: "360px" }}
        filter={user.data?.banner ? "" : "brightness(0.4)"}
      />
      <Flex
        zIndex="2"
        borderRadius="5px"
        bg="#181818"
        alignItems="center"
        margin="-2rem auto 2rem"
        flexDir="column"
      >
        <Flex zIndex="2" margin="15px auto" color="white">
          <Link
            _hover={{}}
            onClick={() => {
              setIsCurrentActive("Posts");
            }}
            position="relative"
            pb="5px"
            _after={
              isCurrentActive == "Posts"
                ? {
                    transition: "all ease-in-out .3s",
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: " #FFE767",
                  }
                : {
                    transition: "all ease-in-out .3s",
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "0%",
                    height: "1px",
                    background: " #FFE767",
                  }
            }
            fontSize="18px"
            margin="0 1rem"
          >
            Posts
          </Link>
          <Link
            _hover={{}}
            onClick={() => {
              setIsCurrentActive("Artistas");
            }}
            position="relative"
            fontSize="18px"
            margin="0 1rem"
            _after={
              isCurrentActive == "Artistas"
                ? {
                    transition: "all ease-in-out .3s",
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: " #FFE767",
                  }
                : {
                    transition: "all ease-in-out .3s",
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "0%",
                    height: "1px",
                    background: " #FFE767",
                  }
            }
          >
            Artistas
          </Link>
        </Flex>
      </Flex>

      <Flex h="fit-content">
        {!!isLoading ? (
          <Spinner m="0 auto" size="md" />
        ) : isCurrentActive === "Posts" ? (
          <Flex flexWrap={"wrap"} w="100%">
            {data?.favoritePostsData.map((post) => {
              return <PostPrev post={post} isFlex={true} key={post.id} />;
            })}
          </Flex>
        ) : (
          <Flex gap={"1rem"} flexWrap={"wrap"} w="100%">
            {data?.favoriteUsersData.map((client) => {
              return <UserPrev user={client.user} key={client.user.user} />;
            })}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
