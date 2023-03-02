import levenshtein from 'fast-levenshtein';

export const searchEngine = async (data, searchTerm,searchType='') => {
  try {
    let newDataArray = []
    let userArray = []
    data.map(dataValue=>{
      userArray.push(dataValue.user)
      newDataArray.push(
        [...dataValue.posts.filter(post=>post.posted==true).map(post=>{
          return{
            ...post,
            ...dataValue.user
          }
        })]
      )
    })

    if(searchType==='byUser'){
      let filteredData = userArray.filter(item => {
        return (
          levenshtein.get(item.user.toLowerCase(), searchTerm.toLowerCase()) <= 4
        )
      });
      filteredData.sort((a, b) => {
        const aScore = Math.min(
          levenshtein.get(a.user, searchTerm),
        )
        const bScore = Math.min(
          levenshtein.get(b.user, searchTerm),
        )
        return aScore - bScore;
      });
      console.log(filteredData)
      return filteredData;
    }
    if(searchType=='byPosts'){
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