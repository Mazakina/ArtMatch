import {createContext, useState, ReactNode, SetStateAction, Dispatch, useMemo} from 'react'
import { Api } from '../services/api';
import { useSession } from 'next-auth/react';

interface UserProps {
  ref:string
  ts:number|string,
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}
interface userCxtProps{
  user:UserProps,
  favoritePosts:string[],
  setFavoritePosts: Dispatch<SetStateAction<string[]>>|null
  favoriteUsers:number[],
  setFavoriteUsers: Dispatch<SetStateAction<number[]>>|null
}
interface ProviderProps {
  children:ReactNode
}

export const UserContext = createContext<userCxtProps>({
    favoritePosts:[],
    favoriteUsers:[],
    user:{
      ref:'',
      ts:'',
      data:{
        user:'',
        banner:'',
        avatar:'',
    }},
    setFavoritePosts:null,
    setFavoriteUsers:null,
 });

export const UserProvider = ({children}:ProviderProps)=>{
  const {data} = useSession()
  const [favoritePosts,setFavoritePosts] = useState<string[]>([])
  const [favoriteUsers,setFavoriteUsers] = useState<Array<number>>([])
  const [user,setUser] = useState<UserProps>({
      ref:'',
      ts:'',
      data:{
        user:'',
        banner:'',
        avatar:'',
      }
   })
   console.log(favoriteUsers[0])
  useMemo(()=>{if(data){
    Api.post('/lib/userSettings/getUser',{data}).then(response => {setFavoriteUsers(response.data.favoritedUsers);setUser(response.data.user);setFavoritePosts(response.data.favoritedPosts.data.posts)})
  }},[data])

  return(
    <UserContext.Provider value={{user,favoritePosts,setFavoritePosts,favoriteUsers,setFavoriteUsers}}>
      {children}
    </UserContext.Provider>
  )
}
