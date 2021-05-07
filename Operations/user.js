const pool=require('../dbConnection');
const User=require('../Schema/user');
const sql = require('mssql/msnodesqlv8')

async function getUsers(){
    try{
        let students=await pool.request().query("SELECT * from User");
        return students;
    }
    catch(err){
        console.log(err);
    }
}

async function getUserById(id){
    try{
        let user=await pool.request()
        .input("id",sql.Int,id)
        .query("SELECT * from User where ID=@id");
        return student;
    }
    catch(err){
        console.log(err);
    }
}

async function addUser(newUser)
{

    try{
        let user=await pool.request()
        .input("Email",sql.NChar(20),newUser.Email)
        .input("Username",sql.NChar(30),newUser.Username)
        .input("Gender",sql.NChar(10),newUser.Gender)
        .input("Age",sql.Int,newUser.Age)
        .input("Password",sql.NChar(20),newUser.Password)
        .query("Insert into User Values(@Email,@Username,@Gender,@Age,@Password)")
        
        return "User added successfuly ";

    }
    catch(err){
          return err;


    }
}

async function updateUser(id,newUser)
{
    let user =await pool.request()
    .input("id",sql.Int,id)
    .query("select * from User where ID=@id")
    if(user.recordsets[0].length==0) return "User ID is not exist";

    try{
        let updatedStudent=await pool.request()
        .input("id",sql.Int,id)
        .input("Email",sql.NChar(20),newUser.Email)
        .input("Username",sql.NChar(30),newUser.Username)
        .input("Gender",sql.NChar(10),newUser.Gender)
        .input("Age",sql.Int,newUser.Age)
        .input("Password",sql.NChar(20),newUser.Password)
        .query("Update User  Set Email=@Email, Username=@Username ,Gender=@Gender, Age=@Age, Password=@Password where ID=@id")
        
        return "User updated successfuly ";

    }
    catch(err){
     
          return err;


    }
}


async function DeleteUser(id){
     let user=await pool.request().input("id",sql.Int,id)
     .query("select * from User where ID=@id")

     if(user.recordsets[0].length==0) return "the user ID is not exist";
     try
     {
         await pool.request().input("id",sql.Int,id)
         .query("Delete from User where ID=@id")

         return "User Deleted Successfuly";
     }
     catch(err)
     {
         return err
     }
}

module.exports={
      getUsers,
      getUserById,
      addUser,
      updateUser,
      DeleteUser
}