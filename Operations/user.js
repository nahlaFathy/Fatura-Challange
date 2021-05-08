const pool=require('../dbConnection');
const User=require('../Schema/user');
const sql = require('mssql/msnodesqlv8')
const bcrypt = require('bcrypt')

async function getUsers(){
    try{
        let users=await pool.request().query("SELECT * from [User]");
        return users;
    }
    catch(err){
        console.log(err);
    }
}

async function getUserById(id){
    try{
        let user=await pool.request()
        .input("id",sql.Int,id)
        .query("SELECT * from [User] where ID=@id");
        return user;
    }
    catch(err){
        console.log(err);
    }
}


async function getUserByEmail(email){
    try{
        let user=await pool.request()
        .input("email",sql.NChar(30),email)
        .query("SELECT * from [User] where Email=@email");
        return user;
    }
    catch(err){
        console.log(err);
    }
}

async function addUser(newUser)
{
        // check if this email registered before 
       let if_Exist=await pool.request()
       .input("Email",sql.NChar(30),newUser.Email)
       .query("select * from [User] where Email=@Email")
      
       if(if_Exist.recordsets[0].length>0) return {message:"This Email is already registered" ,code:409}

        //// hashing password
        const salt = await bcrypt.genSalt(10);
      var pass=newUser.Password;
       newUser.Password = await bcrypt.hash(newUser.Password, salt)
       console.log(await bcrypt.compare(pass,newUser.Password))
       console.log(newUser.Password)

    try{
        

        let user=await pool.request()
        .input("Email",sql.NChar(30),newUser.Email)
        .input("Username",sql.NChar(20),newUser.Username)
        .input("Gender",sql.NChar(10),newUser.Gender)
        .input("Age",sql.Int,newUser.Age)
        .input("Password",sql.VarChar(120),newUser.Password)
        .query("Insert into [User] Values(@Username,@Email,@Gender,@Age,@Password)")
        
        return {message:"User registered successfully " ,code:200};

    }
    catch(err){
          return err;


    }
}

async function updateUser(id,newUser)
{
    let user =await pool.request()
    .input("id",sql.Int,id)
    .query("select * from [User] where ID=@id")
    if(user.recordsets[0].length==0) return {message:"the user ID is not exist" ,code:404}

    try{
        let updatedStudent=await pool.request()
        .input("id",sql.Int,id)
        .input("Email",sql.NChar(20),newUser.Email)
        .input("Username",sql.NChar(30),newUser.Username)
        .input("Gender",sql.NChar(10),newUser.Gender)
        .input("Age",sql.Int,newUser.Age)
        .input("Password",sql.VarChar(120),newUser.Password)
        .query("Update [User]  Set Email=@Email, Username=@Username ,Gender=@Gender, Age=@Age, Password=@Password where ID=@id")
        
       return {message:"User Updated Successfuly" ,code:200}

    }
    catch(err){
     
          return err;


    }
}


async function DeleteUser(id){
     let user=await pool.request().input("id",sql.Int,id)
     .query("select * from [User] where ID=@id")

     if(user.recordsets[0].length==0) return {message:"the user ID is not exist" ,code:404}
     try
     {
         await pool.request().input("id",sql.Int,id)
         .query("Delete from [User] where ID=@id")

         return {message:"User Deleted Successfuly" ,code:200}
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
      DeleteUser,
      getUserByEmail
}