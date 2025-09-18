const [, , action, ...numbers] = process.argv;
console.log("🚀 ~ params:", action, numbers);

//adding 
function add(numbers) {
  return numbers.reduce((acc, val) => {
    return acc + parseInt(val);
  }, 0);
}

//divide
function divide(numbers) {
  if (parseInt(numbers[1]) !== 0) {
    return parseInt(numbers[0]) / parseInt(numbers[1]);
  }
  console.error("the second number can't be zero");
}
//subtract 
function subtract(numbers){
    if (numbers.length < 2) {
    console.error("Subtract needs at least 2 numbers");
    return;
    }
    return numbers.reduce((acc,val)=>{
        return acc - parseInt(val);
    });
}
//multi 
function multi(numbers){
    if (numbers.length < 2) {
    console.error("Multiply needs at least 2 numbers");
    return;
    }
    return numbers.reduce((acc,val)=>{
        return acc * parseInt(val);
    },1);
}


let result;
switch (action) {
  case "add":
    result = add(numbers);
    break;
  case "divide":
    result = divide(numbers);
    break;
  case "subtract":
    result = subtract(numbers);
    break;
  case "multi":
    result = multi(numbers);
    break;
  default:
    console.error("wrong action");
    break;
}

if (result !== undefined) {
  console.log("Your result is:", result);
}
