import { Flex, Tag, TagLabel,} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";

interface SkillTagSectionProps{
  habilidades:string[],
  skillList:{
    id:string,
    name:string,
    icon:string
  }[]
}

const SkillsTagSection = React.memo<SkillTagSectionProps>(function SkillsTagSection({habilidades=[],skillList=[]}) {
  let displayArray = skillList.filter(skill=>{
    return(habilidades.includes(skill.id))
  })
  return(
    <Flex rowGap={'.5rem'} overflow={'auto'} maxW={'100%'} mt='.5rem' flexWrap={'wrap'} maxHeight={'100%'}>
      { displayArray.map(tag =>{
        return(
          <SkillTag name={tag.name} key={tag.id}  />
        )
      })}
    </Flex>
  )
});


export function SkillTag({name}){
  return(
    <Tag maxHeight={'1rem'}  color='#FFEB80' ml='.5rem' bg='#151515' border='1px solid #FFEB80' borderRadius={'.2rem'}>
      <TagLabel m='.25rem'>{name}</TagLabel>
    </Tag>
  )
};

export default SkillsTagSection;