import {createContext, useEffect, useState, useContext, ReactNode, SetStateAction, Dispatch, useCallback, useMemo} from 'react'
import { Api } from '../services/api';
import { useSession } from 'next-auth/react';

interface UserProps {
  ref:string,
  ts:number|string,
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}
interface userCxtProps{
  user:UserProps,
  favorites:string[],
  setFavorites: Dispatch<SetStateAction<string[]>>|null

}
interface ProviderProps {
  children:ReactNode
}

export const UserContext = createContext<userCxtProps>({
    favorites:[],
    user:{
      ref:'',
      ts:'',
      data:{
        user:'',
        banner:'',
        avatar:'',
    }},
    setFavorites:null
 });



export const UserProvider = ({children}:ProviderProps)=>{
  const {data} = useSession()
  const [favorites,setFavorites] = useState<string[]>([])
  const [user,setUser] = useState<UserProps>({
      ref:'',
      ts:'',
      data:{
        user:'',
        banner:'',
        avatar:'',
      }
   })
  useMemo(()=>{if(data){
   Api.post('/lib/userSettings/getUser',{data}).then(response => {setUser(response.data.user),setFavorites(response.data.favoritedPosts.data.posts)})
  }},[data])
  return(
    <UserContext.Provider value={{user,favorites,setFavorites}}>
      {children}
    </UserContext.Provider>
  )
}
