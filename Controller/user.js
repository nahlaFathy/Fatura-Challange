const pool = require('../dbConnection');
const sql = require('mssql/msnodesqlv8')
const bcrypt = require('bcrypt')
const Blacklist = require('../helper/TokenBlackList');
const jwt = require('jsonwebtoken');


/* #region get all users */
exports.getUsers = async (req, res) => {

    try {
        let users = await pool.request().query("SELECT * from [User]");
        if (users) return res.send(users.recordsets[0]);
        else return res.status(404).send("something went wrong");
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */


/* #region get useer by id */
exports.getUserById = async (req, res) => {
    // if request path contain variable in query string so it will be logined id 
    //else id will be extracted from login user token 
    const loginedID = (req.params.id != null && req.params.id != undefined) ? req.params.id : req.user.ID;

    try {
        let user = await pool.request()
            .input("id", sql.Int, loginedID)
            .query("SELECT * from [User] where ID=@id");
        if (user.recordsets[0].length == 0) return res.status(404).send("This user id is not exist")
        else return res.send(user.recordsets[0]);
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */

/* #region add user */
exports.addUser = async (req, res) => {
    // check if this email registered before 
    const newUser = req.body
    let if_Exist = await pool.request()
        .input("Email", sql.NChar(30), newUser.Email)
        .query("select * from [User] where Email=@Email")

    if (if_Exist.recordsets[0].length > 0) return res.status(409).send({ message: "This Email is already registered" })

    //// hashing password
    const salt = await bcrypt.genSalt(10);
    newUser.Password = await bcrypt.hash(newUser.Password, salt)


    try {
        //// role is set implicitly only in backend by developer or it will has 'user' default value 
        let role = (newUser.role != undefined && newUser.role != null) ? newUser.role : 'user'
        await pool.request()
            .input("Email", sql.NChar(30), newUser.Email)
            .input("Username", sql.NChar(20), newUser.Username)
            .input("Gender", sql.NChar(10), newUser.Gender)
            .input("Age", sql.Int, newUser.Age)
            .input("Password", sql.VarChar(120), newUser.Password)
            .input("role", sql.VarChar(20), role)
            .query("Insert into [User] Values(@Username,@Email,@Gender,@Age,@Password,@role)")

        return res.status(409).send({ message: "User registered successfully " });

    }
    catch (err) {
        return res.send(err);
    }
}
/* #endregion */

/* #region update user */
exports.updateUser = async (req, res) => {
    const loginedID = (req.params.id != undefined && req.params.id != null) ? req.params.id : req.user.ID;
    const newUser = req.body;
    /// check if user id is exist 
    let user = await pool.request()
        .input("id", sql.Int, loginedID)
        .query("select * from [User] where ID=@id")

    if (user.recordsets[0].length == 0) return res.status(404).send({ message: "the user ID is not exist" })

    /// if user send new password
    if (newUser.Password != undefined && newUser.Password != null) {
        //// hashing password
        const salt = await bcrypt.genSalt(10);
        newUser.Password = await bcrypt.hash(newUser.Password, salt)

    }

    const userData = user.recordsets[0][0];
    console.log(loginedID)
    ////// updated data set by request body data else set by the actual data from DB
    let updatedValues = {
        ID: loginedID,
        Email: (newUser.Email != undefined && newUser.Email != null) ? newUser.Email : userData.Email,
        Username: (newUser.Username != undefined && newUser.Username != null) ? newUser.Username : userData.Username,
        Gender: (newUser.Gender != undefined && newUser.Gender != null) ? newUser.Gender : userData.Gender,
        Age: (newUser.Age != undefined && newUser.Age != null) ? newUser.Age : userData.Age,
        Password: (newUser.Password != undefined && newUser.Password != null) ? newUser.Password : userData.Password,
        role: (newUser.role != undefined && newUser.role != null) ? newUser.role : userData.role
    }

    try {

        await pool.request()
            .input("id", sql.Int, updatedValues.ID)
            .input("Email", sql.NChar(20), updatedValues.Email)
            .input("Username", sql.NChar(30), updatedValues.Username)
            .input("Gender", sql.NChar(10), updatedValues.Gender)
            .input("Age", sql.Int, updatedValues.Age)
            .input("Password", sql.VarChar(120), updatedValues.Password)
            .input("role", sql.VarChar(20), updatedValues.role)
            .query("Update [User]  Set Email=@Email, Username=@Username ,Gender=@Gender, Age=@Age, Password=@Password ,role=@role where ID=@id")

        return res.status(200).send({ message: "User Updated Successfuly" })

    }
    catch (err) {

        return res.send(err);
    }
}
/* #endregion */

/* #region delete user */
exports.DeleteUser = async (req, res) => {
    const loginedID = (req.params.id != undefined && req.params.id != null) ? req.params.id : req.user.ID;
    //// check if user id is exist 
    let user = await pool.request()
        .input("id", sql.Int, loginedID)
        .query("select * from [User] where ID=@id")

    if (user.recordsets[0].length == 0) return res.status(404).send({ message: "the user ID is not exist" })
    try {
        await pool.request()
            .input("id", sql.Int, loginedID)
            .query("Delete from [User] where ID=@id")


        return res.status(200).redirect('http://localhost:3000/api/logout')
    }
    catch (err) {
        return res.send(err);
    }
}
/* #endregion */

/* #region logout */
exports.logout = async (req, res) => {
    token = req.token;

    /// invalidate token by adding it to blacklist
    (await Blacklist).add(token);

    //// invalidate session token by destroy it and clear cookie
    res.clearCookie('user');
    req.session.destroy(err => {
        if (err) {
            return res.send(err)
        }

        res.send("Loggedout successfully");
    })
}
/* #endregion */

/* #region login */
exports.login = async (req, res) => {


    ///// check if email is registered before 
    const email = req.body.Email
    let user = await pool.request()
        .input("email", sql.NChar(30), email)
        .query("SELECT * from [User] where Email=@email");

    if (user.recordsets[0].length == 0) return res.status(403).send("Invalid Email or Password")


    var myUser = user.recordsets[0][0];


    /////////// chech if password match email password 
    const validPassword = await bcrypt.compare(req.body.Password, myUser.Password)
    if (validPassword === false) return res.status(403).send('Invalid Email or Password')

    ///// Generate user token and session
    const token = jwt.sign({ ID: myUser.ID, role: myUser.role }, process.env.SECRET_KEY, { expiresIn: '1h' })
    // set user session with session id 
    req.session.user = req.session.id;
    req.cookies.user = req.session.id;

    return res.header('x-user-token', token).send({
        message: 'logined in successfully',
        token: token
    })
}
/* #endregion */