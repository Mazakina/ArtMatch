export function capitalizeFirstLetter(str) {
  if(str){
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}