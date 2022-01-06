const hotDealsModel = require('../model/hotdeals');

const hotDealsService = {}

hotDealsService.getHotDealsCollection = () => {
    return hotDealsModel.getHotDealsCollection().then((hotDeals) => {
        if (hotDeals) {
            return hotDeals
        }
        else {
            let hotDealsError = new Error("Sorry! Hot Deals can not be displayed at the moment")
            hotDealsError.status = 404
            throw hotDealsError
        }
    })
}

module.exports = hotDealsService