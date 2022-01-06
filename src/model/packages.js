const connection = require("../utilities/connections")

const packagesModel = {}

packagesModel.getDestinationCollection = (searchInput) => {
    return connection.getDestinationCollection().then(collection => {
        return collection.find({ continent: searchInput }, { _id: 0, __v: 0 }).then(data => {
            if (data.length > 0) {
                // console.log('if ' + searchInput);
                return data
            }
            else {
                // console.log('else ' + searchInput);
                return collection.find({ "details.itinerary.tourHighlights": searchInput }, { _id: 0, __v: 0 }).then(data => {
                    if (data.length > 0) {
                        return data
                    }
                    else {
                        return null
                    }
                })
            }
        })
    })
}

packagesModel.getPackageNames = () => {

    var packageNames = []

    return connection.getDestinationCollection().then(collection => {
        return collection.distinct("continent").then(destCont => {
            packageNames = packageNames.concat(destCont)

            return collection.distinct("details.itinerary.tourHighlights").then(tourNames => {
                packageNames = packageNames.concat(tourNames)

                return connection.getHotDealsCollection().then(collection => {
                    return collection.distinct("details.itinerary.tourHighlights").then(HDtourNames => {

                        packageNames = packageNames.concat(HDtourNames)
                        
                        let finalPackageNames = [...new Set(packageNames)]
 
                        return finalPackageNames
                    })
                })
            })

        })
    })
}

module.exports = packagesModel