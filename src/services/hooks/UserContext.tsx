import {createContext, useState, ReactNode, SetStateAction, Dispatch, useMemo, useEffect} from 'react'
import { Api } from '../api';
import { useSession } from 'next-auth/react';
import {useQuery} from 'react-query'


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

  async function getContextData (){
    const response = await Api.post('/lib/userSettings/getUser',{data})
    return response
  }

  const {isLoading,error,data:queryData} = useQuery('clientUser',getContextData,{enabled: !!data})
  useEffect(()=>{if(queryData){
    setFavoriteUsers(queryData.data.favoritedUsers);setUser(queryData.data.user);setFavoritePosts(queryData.data.favoritedPosts)}}
  ,[queryData])

  return(
    <UserContext.Provider value={{user,favoritePosts,setFavoritePosts,favoriteUsers,setFavoriteUsers}}>
      {children}
    </UserContext.Provider>
  )
}
