const userDB = require('../model/userslogin');

const userService = {}

//login a user
userService.login = (contactNo, userPassword) => {
    return userDB.checkUser(contactNo).then((user) => {
        if (!user) {
            let err = new Error("Enter registered contact number! If not registered, please register")
            err.status = 404
            throw err
        }
        else {
            return userDB.getPassword(contactNo).then((password) => {
                if (password != userPassword) {
                    let err = new Error("Incorrect password")
                    err.status = 406
                    throw err
                }
                else {
                    return user;
                }
            })
        }
    })
}

userService.register = (userObj) => {
    
    return userDB.register(userObj).then(data => {
        if (data == true) {
            return true;
        }else{
            let err = new Error("ACCOUNT ALREADY EXISTS FOR THE GIVEN CONTACT NUMBER.")
            err.status = 406
            throw err;
        }
    })
}

userService.viewBookings=(userId)=>{
    return userDB.viewBookings(userId).then(arr=>{
        if(arr.length>0){
            return arr;
        }else{
            let err = new Error(" Couldn't get bookings by user Id")
            err.status = 406
            throw err;
        }
    })
}

module.exports = userService
