const connection = require("../utilities/connections")

const hotDealsModel = {}

hotDealsModel.getHotDealsCollection = () => {
    return connection.getHotDealsCollection().then(collection => {
        return collection.find({}, { _id: 0, __v: 0 }).then(data => {
            if (data) {
                return data
            }
            else {
                return null
            }

        })
    })
}

module.exports = hotDealsModel