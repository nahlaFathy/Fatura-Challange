# Fatura-Challange
note : to run this project you should run redis server using (redis-server) command in terminal then nodemon to run node index file

- User backend APIs 
- created by Nodejs + SQL server for database 
- Express framework 
- Redis datastore 
- Postman to test all routes and create API doc in this link :
          https://documenter.getpostman.com/view/14400429/TzRUA79u


- Develpoing steps : 
   - Extract requirments 
   - Creating database with user table 
     { 
         - ID : Int, primary key ,identity ,not null
         - Email : nchar(30) ,not null
         - Username : ncahr(20) ,not null
         - Password : varchar(120) for store hashed password string ,not null
         - Gender : nchar (10) , not null
         - Age : Int , not null
         - role : varchar (20) , not null with default value 'user'

     } 

   - Create node enviroment using npm "express" framework                        (index.js)
         
   - Create database connection using npm "mssql" and "msnodesqlv8"              (dbConnection.js)
      mssql: Microsoft SQL Server client for Node.js used to create a database connection with sql server 
             It enables us to write a sql DQL queries 
      msnodesqlv8 : used to create connection with windowns authentications so there is no need to provide sql server authentication credentials 

   - Create user shcema class with its columns names                       (/Schema/user.js)

   - Create user operations logic to be used in CRUD routes                (/Controller/user.js)
         - used async and await keywords to enable asynchronous by suspending execution until the returned 
           callback or promise is fulfilled or rejected
         - in register check if email is register before or no then used npm "bcrypt" to hashing user password before 
           store it in database so no one can   
           know the password 
         - user role property will be "user" by default and only developers can change the role 
         - in login check if the credentials is for registered email or no then generate the user token with payload
           contains user id and user role and expire time 1 hour then set request session with session unique id 
           and set header with user token 
         - in logout invalidate user token by add it to blacklist and destroying established session 
         
   - Create user routes to define APIs pathes                        (/Routes/user.js)
         - routes created by using express.router => express.router().get(endpoint,callback)
         - routes have some parameters :
              - endpoint It’s the value that comes after your domain name 
              - callback tells the server what to do when the requested endpoint matches the endpoint stated
              - optional parameter to add middleware that return a callback 

   - middlewares:

         - JWT authentication middleware                    (/middleware/jwtauth.js)
                   used to create token-based authentication  
                   using npm "jsonwebtoken"  this middleware check whether request contain token or no 
                   if true it check if this token blocked or no , if not blocked it decode the token using 
                   jwt.verify function and the secret key to determine if this token is valid or not if valid it set the request with the user data in payload part in token  
                   - i used npm "jwt-blacklist" to block invalid tokens so no one can use it until it expire and store blocked tokens in redis datastore

         - Session authentication middleware                  (/middleware/jwtauth.js)
                   used to create session-based authentication  
                   using  npm "express-session" it check if there is a established session or no 
                   the session data stored in redis 

         - User roles middleware                              (/middleware/userRoles.js)
                   used to check if user has a permission to do that action based on his role or no
                   using npm "accesscontrol" in (/helper/Authorization.js) it grant or deny the role with its allowed 
                   permessions  

         - Request Body validation middleware                   (/middleware/reqBodyValidator.js)
                   used to check if the request body contains the required values to do the action or no
                   using npm "express-validator" it contain to parts a function that contains validation 
                   rules with error messages for each role and a callback for the validation result 
                   I ceated two validators for login request and for register request to ensure that client side 
                   send a correct data before send it to the databse 

    - used npm "dotenv" to store any keys in .env file 
    




    In this task I learned  
           - using session authentication i used to use tokens only 
           - apply authorization roles and permessions in server-side 
             I apllied it before in client-side
           - create API documentation 
             


