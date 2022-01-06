const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersDB = {}

usersDB.generateId = () => {
    return connection.getUserCollection().then((model) => {
        return model.distinct("userId").then((ids) => {
            let val = ids.length - 1;
            let bId = ids[val].substring(1);
            let id = Number(bId) + 1;
            let nbId = "U" + id;
            return nbId;
        })
    })
}

usersDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {               
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersDB.getPassword = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "contactNo": contactNo }, { _id: 0, password: 1 }).then((password) => {
            if (password.length != 0)
                return password[0].password;
            else
                return null;
        })
    })
}


usersDB.register = (userObj) => {
    return usersDB.checkUser(userObj.contactNo).then(obj => {
        console.log(obj);
        if (!obj) {
            return usersDB.generateId().then(bId => {
                userObj.userId = bId;
                return connection.getUserCollection().then(model => {
                    return model.insertMany(userObj).then(data => {
                        if (data) {
                            console.log(data);
                            return true;
                        }
                    })
                })
            })
        } else {
            return false;
        }
    })

}

usersDB.viewBookings=(userId)=>{
    return connection.getBookingCollection().then(model=>{
        return model.find({userId:userId}).then(arr=>{
            if(arr.length>0){
                return arr;
            }
        })
    })
}

module.exports = usersDB;
