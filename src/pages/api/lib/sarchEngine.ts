import axios from 'axios';
import levenshtein from 'fast-levenshtein';

export const searchEngine = async (data, searchTerm,searchType='') => {
  try {
    let newDataArray = []
    let userArray = []
    data.map(dataValue=>{
      userArray.push(dataValue.user)
      newDataArray.push(
        [...dataValue.posts[0].filter(post=>post.posted==true).map(post=>{
          return{
            ...post,
            ...dataValue.user
          }
        })]
      )
    })

    if(searchType=='byUser'){
    
    // const response = await axios.get(`http://localhost:3000/api/searchEngine?q=${searchTerm}`);
    const filteredData = userArray.filter(item => {
    return (
      levenshtein.get(item.user, searchTerm) <= 4
    )
  });

  filteredData.sort((a, b) => {
    const aScore = Math.min(
      levenshtein.get(a.title, searchTerm),
    )
    const bScore = Math.min(
      levenshtein.get(b.title, searchTerm),
    )
    return aScore - bScore;
  });
    return filteredData;}
    if(searchType=='byPosts'){
      // const response = await axios.get(`http://localhost:3000/api/searchEngine?q=${searchTerm}`);

      let filteredData=[]
      newDataArray.map(postsByUser=>{
        postsByUser.map(post=>
        filteredData.push(post)
        )
      });

      filteredData = filteredData.filter(item => {
        return (
          levenshtein.get(item.title, searchTerm) <= 4
          ||
          item.tags.some(tag => levenshtein.get(tag, searchTerm) <= 4) 
        )
      })

      filteredData.sort((a, b) => {
        const aScore = Math.min(
          levenshtein.get(a.title, searchTerm),
          ...a.tags.map(tag => levenshtein.get(tag, searchTerm)),
        )
        const bScore = Math.min(
          levenshtein.get(b.title, searchTerm),
          ...b.tags.map(tag => levenshtein.get(tag, searchTerm)),
        )
        return aScore - bScore;
      });
      return filteredData;
    }
  } catch (error) {
    console.error(error);
  }
};