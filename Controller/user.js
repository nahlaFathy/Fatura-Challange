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
       newUser.Password = await bcrypt.hash(newUser.Password, salt)
      

    try{
        
        let role=(newUser.role != undefined && newUser.role != null) ? newUser.role : 'user'
        let user=await pool.request()
        .input("Email",sql.NChar(30),newUser.Email)
        .input("Username",sql.NChar(20),newUser.Username)
        .input("Gender",sql.NChar(10),newUser.Gender)
        .input("Age",sql.Int,newUser.Age)
        .input("Password",sql.VarChar(120),newUser.Password)
        .input("role",sql.VarChar(20),role)
        .query("Insert into [User] Values(@Username,@Email,@Gender,@Age,@Password,@role)")
        
        return {message:"User registered successfully " ,code:201};

    }
    catch(err){
          return err;
    }
}

async function updateUser(id,newUser)
{
    /// check if user id is exist 
    let user =await pool.request()
    .input("id",sql.Int,id)
    .query("select * from [User] where ID=@id")

    if(user.recordsets[0].length==0) return {message:"the user ID is not exist" ,code:404}
    
    /// if user send new password
    if(newUser.Password != undefined && newUser.Password != null){
            //// hashing password
            const salt = await bcrypt.genSalt(10);
            newUser.Password = await bcrypt.hash(newUser.Password, salt)

    }

     const userData=user.recordsets[0][0];
    
     ////// updated data set by request body data else set by the actual data from DB
     let updatedValues={
         ID:id,
         Email:(newUser.Email != undefined && newUser.Email != null) ? newUser.Email : userData.Email,
         Username:(newUser.Username != undefined && newUser.Username != null) ? newUser.Username : userData.Username,
         Gender:(newUser.Gender != undefined && newUser.Gender != null) ? newUser.Gender :userData.Gender,
         Age:(newUser.Age != undefined && newUser.Age != null) ? newUser.Age :userData.Age,
         Password:(newUser.Password != undefined && newUser.Password != null) ? newUser.Password : userData.Password,
         role:(newUser.role != undefined && newUser.role != null) ? newUser.role : 'user'
     }
     
    try{
        let updatedUser=await pool.request()
        .input("id",sql.Int,id)
        .input("Email",sql.NChar(20), updatedValues.Email)
        .input("Username",sql.NChar(30), updatedValues.Username)
        .input("Gender",sql.NChar(10), updatedValues.Gender)
        .input("Age",sql.Int, updatedValues.Age)
        .input("Password",sql.VarChar(120), updatedValues.Password)
        .input("role",sql.VarChar(20),role)
        .query("Update [User]  Set Email=@Email, Username=@Username ,Gender=@Gender, Age=@Age, Password=@Password ,role=@role where ID=@id")
        
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