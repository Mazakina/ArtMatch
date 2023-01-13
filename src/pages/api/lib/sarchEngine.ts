import axios from 'axios';
import levenshtein from 'fast-levenshtein';

export const searchEngine = async (data, searchTerm) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/searchEngine?q=${searchTerm}`);
    const filteredData = data.filter(item => {
    return (
      levenshtein.get(item.name, searchTerm) <= 2 ||
      item.tags.some(tag => levenshtein.get(tag, searchTerm) <= 2) ||
      item.users.some(user => levenshtein.get(user, searchTerm) <= 2)
    )
  });
  
  filteredData.sort((a, b) => {
    const aScore = Math.min(
      levenshtein.get(a.name, searchTerm),
      ...a.tags.map(tag => levenshtein.get(tag, searchTerm)),
      ...a.users.map(user => levenshtein.get(user, searchTerm))
    )
    const bScore = Math.min(
      levenshtein.get(b.name, searchTerm),
      ...b.tags.map(tag => levenshtein.get(tag, searchTerm)),
      ...b.users.map(user => levenshtein.get(user, searchTerm))
    )
    return aScore - bScore;
  });
    return filteredData;
  } catch (error) {
    console.error(error);
  }
};