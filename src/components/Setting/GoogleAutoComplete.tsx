import {useLoadScript,Marker} from '@react-google-maps/api'

import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox'
import "@reach/combobox/styles.css"
import { Box, Input } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface GoogleAutocompleteProps{
  setEndereco:Dispatch<SetStateAction<any>>,
  address:string
}

export default function GoogleAutoComplete({setEndereco,address}:GoogleAutocompleteProps){
  const {isLoaded} = useLoadScript({
    googleMapsApiKey:'AIzaSyCZwRzt_H82DOiO-HM1o6C2NXZBlblrJRA',
    libraries:["places"]
  })

  if(!isLoaded){ return <div>Loading...</div>}
  return <Map address={address} setEndereco={setEndereco}/>
}

function Map({setEndereco,address}){
  return(
    <>
      <Box maxWidth={{base:'100%',md:'340px'}} w='100%'>
        <PlacesAutocomplete setEndereco={setEndereco} address={address}/>
      </Box>
    </>
  )
}


export const PlacesAutocomplete = ({setEndereco,address})=>{
  const {
    ready,
    value,
    setValue,
    suggestions:{status,data},
    clearSuggestions
  } = usePlacesAutocomplete() 
  useEffect(()=>{
    setValue(address,false)
  },[])
  async function handleSelect(address){
    setValue(address, false);
    console.log(address)
    setEndereco(address)
    clearSuggestions();
  }
  return (
    <Combobox  className='combobox' onSelect={handleSelect}>
      <Input autoComplete='off' p='.2rem' w='100%' m='0' as={ComboboxInput} value={value} onChange={(e)=>{setValue(e.target.value)}} disabled={!ready} placeholder='Procurar endereço' />
      <ComboboxPopover>
        <ComboboxList className='combobox-list'>
          {status === 'OK' && data.map(({place_id, description})=>(
          <ComboboxOption value={description} key={place_id}/>
          ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}
