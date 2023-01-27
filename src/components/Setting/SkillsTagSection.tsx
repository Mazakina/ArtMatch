import { Flex, Tag, TagLabel,} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";

interface SkillTagSectionProps{
  skills:{
    id:string,
    name:string,
    icon:string
  }[],
}

const SkillsTagSection = React.memo<SkillTagSectionProps>(function SkillsTagSection({skills=[]}) {
  return(
    <Flex rowGap={'.5rem'} overflow={'auto'} maxW={'100%'} mt='.5rem' flexWrap={'wrap'} maxHeight={'100%'}>
      { skills.map(tag =>{
        return(
          <SkillTag tag={tag.name} key={tag.name}  />
        )
      })}
    </Flex>
  )
});


export function SkillTag({tag}){
  return(
    <Tag maxHeight={'1rem'}  color='#FFEB80' ml='.5rem' bg='#151515' border='1px solid #FFEB80' borderRadius={'.2rem'}>
      <TagLabel m='.25rem'>{tag}</TagLabel>
    </Tag>
  )
};

export default SkillsTagSection;