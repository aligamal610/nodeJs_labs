import fs from "fs/promises";

const data = await fs.readFile("./users.json", "utf-8");
let parsedData = JSON.parse(data);
// console.log("🚀 ~ parsedData:", parsedData);
const [,, action, arg1,arg2] = process.argv;

//get all 
function getAll(){
    console.log(parsedData);
}
//get one user
function getOne(id){
    console.log(parsedData.find((user)=> user.id === parseInt(id)));
}
//add user 
function addUser(name) {
    const newUser = {
        id: Date.now(),
        Name: name,
    };
    parsedData.push(newUser);
    fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
    console.log("User added:", newUser);
}
//remove user by id
function removeUser(id) {
    const beforeLength =parsedData.length ;
    parsedData = parsedData.filter((user) => user.id !== parseInt(id));
    if(beforeLength === parsedData.length){
         console.log("user not found")
    }else{
        fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
        console.log("user removed");
    }
}

//function to edit user 
function editUser(id , userName){
    const user = parsedData.find((user)=>user.id === parseInt(id));
    if(user){
        user.Name=userName;
        fs.writeFile("./users.json", JSON.stringify(parsedData, null, 2));
        console.log("user edited");
    }else{
        console.log("user not found");
    }
}


switch (action) {
    case 'getall':
        getAll();
        break;
    case 'getone':
        getOne(arg1);
        break;
    case 'add':
        addUser(arg1);
        break;
    case 'remove':
        removeUser(arg1);
        break;
    case 'edit':
        editUser(arg1 , arg2);
        break;
    default:
        break;
}




