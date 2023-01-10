import { Flex, Tag, TagLabel, TagLeftIcon, TagRightIcon, TagCloseButton,} from "@chakra-ui/react";

export default function ModalTagList({tags=[],setTags}) {
  function removeTag(tag){
    let newTagArray = tags.filter(value=>{return (value!=tag)})
    setTags(newTagArray)
  }
  console.log(tags)
  return(
    <Flex rowGap={'.5rem'} overflow={'auto'} maxW={'100%'} mt='.5rem' flexWrap={'wrap'} maxHeight={'100%'}>
    { tags.map(tag =>{
      return(
        <TopicTag tag={tag} removeTag={removeTag} />
      )
    })}
    </Flex>
  )
}



export function TopicTag({tag,removeTag}){
  return(
    <Tag maxHeight={'1rem'}  color='white' ml='.5rem' bg='#151515' borderRadius={'1rem'}>
      <TagLabel m='.25rem'>{tag}</TagLabel>
      <TagCloseButton onClick={()=>removeTag(tag)} />
    </Tag>
  )
}