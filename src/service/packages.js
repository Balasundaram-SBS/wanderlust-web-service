const packagesModel = require('../model/packages');

const packagesService = {}

packagesService.getDestinationCollection = (searchInput) => {
    return packagesModel.getDestinationCollection(searchInput).then((packages) => {
        if (packages) {
            return packages
        }
        else {
            let packagesError = new Error("Sorry! Destination Packages can not be displayed at the moment")
            packagesError.status = 404
            throw packagesError
        }
    })
}

packagesService.getPackageNames = () => {
    return packagesModel.getPackageNames().then((packageNames) => {
        if (packageNames) {
            return packageNames
        }
        else {
            let packagesNameError = new Error("No Package Names are available")
            packagesNameError.status = 404
            throw packagesNameError
        }
    })
}

module.exports = packagesService