const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8 ,9, 0];




function getRandom(args){
    const randy = args[Math.floor(Math.random() * args.length)];
    return randy;
}


function isEven(no){
    return no % 2 === 0
}



//Now my architecture should look like this
const uuid = number => {
    let letter;
    let no;
    let id = "";

    for(let i = 0; i < number; i++){
        if(isEven(i)){
            no = getRandom(numbers);
            id = id + no
        } else {
            letter = getRandom(letters);
            id = id + letter
        }
    }
    return id;
}


//ID FETCHER
const shuffle = (symbol, len) => {

    const id = uuid(len);
    const arr = id.split("");
    const firstPart = []
    const secondPart = [];
    let firstCount = 0;
    let secondCount = 0;
    for(let i=0; i < arr.length; i++){
       if(arr.length % i){
         if(firstCount === 4){
            firstPart.push(symbol);
            firstCount = 0;
         }
         firstPart.push(arr[i]);
         firstCount++; 
       }else {
           if(secondCount === 3){
               secondPart.push(symbol);
               secondCount = 0;
           }
         secondPart.push(arr[i]);
         secondCount++;
       }
    }
    return [...firstPart, symbol, ...secondPart].join("");
}

module.exports = shuffle;