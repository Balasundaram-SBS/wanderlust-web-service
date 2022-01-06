const connection = require("../utilities/connections");

const bookDB = {}

bookDB.generateId = () => {
    return connection.getBookingCollection().then((model) => {
        return model.distinct("bookingId").then((ids) => {
            let val = ids.length - 1;
            let bId = ids[val].substring(1);
            let id = Number(bId) + 1;
            let nbId = "B" + id;
            return nbId;
        })
    })
}


bookDB.book = (destId, bookObj) => {

    if (destId.match(/^D/)) {
        return connection.getDestinationCollection().then(destModel => {
            return destModel.updateOne({ destinationId: destId }, { $inc: { availability: -bookObj.noOfPersons } }).then(data => {
                if (data.nModified == 1) {
                    return bookDB.insert(bookObj).then(data => {
                        return data
                    })
                } else {
                    return null
                }
            })
        })
    }

    else if (destId.match(/^HD/)) {
        return connection.getHotDealsCollection().then(hotDealsModel => {

            return hotDealsModel.updateOne({ destinationId: destId }, { $inc: { availability: -bookObj.noOfPersons } }).then(data => {
                if (data.nModified == 1) {
                    return bookDB.insert(bookObj).then(data => {
                        return data
                    })
                } else {
                    return null
                }
            })
        })
    }
}

bookDB.updateDestination = (destId, noOfPersons) => {
    if (destId.match(/^D/)) {
        return connection.getDestinationCollection().then(destModel => {
            return destModel.updateOne({ destinationId: destId }, { $inc: { availability: noOfPersons } }).then(data => {
                return data;
            })
        })
    }

    else if (destId.match(/^HD/)) {
        return connection.getHotDealsCollection().then(hotDealsModel => {
            return hotDealsModel.updateOne({ destinationId: destId }, { $inc: { availability: noOfPersons } }).then(data => {
                return data
            })
        })
    }

}

bookDB.deleteBooking = (bookingId) => {
    return connection.getBookingCollection().then(bookModel => {
        return bookModel.findOne({ bookingId: bookingId }).then(book => {
            if (book) {
                noOfPersons = book.noOfPersons;
                return bookDB.updateDestination(book.destId, book.noOfPersons).then(data => {
                    if (data.nModified > 0) {
                        return connection.getUserCollection().then(userModel => {
                            return userModel.updateOne({ userId: book.userId }, { $pull: { bookings: bookingId } }).then(data => {
                                if (data.nModified > 0) {
                                    return bookModel.deleteOne({ bookingId: bookingId }).then(data => {
                                        if (data.deletedCount > 0) {
                                            return bookingId;
                                        } else {
                                            return null
                                        }
                                    })
                                } else {
                                    return null
                                }
                            })
                        })
                    }

                })
            }
        })
    })
}

bookDB.viewDestination = (destId) => {
    return connection.getDestinationCollection().then(destModel => {
        return destModel.find({ destinationId: destId }).then(arr => {
            if (arr.length > 0) {
                return arr;
            } else {
                return null
            }
        })
    })
}

bookDB.findDate = (bookObj) => {
    return connection.getBookingCollection().then(bookModel => {

        return bookModel.find({ userId: bookObj.userId }).then(data => {

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if ((new Date(bookObj.checkInDate) > new Date(data[i].checkOutDate)) ||
                        (new Date(data[i].checkInDate) > new Date(bookObj.checkOutDate))) {
                        continue
                    }
                    else {
                        return false
                    }
                }
                return true
            }
            else {
                return true
            }
        })
    })
}

bookDB.insert = (bookObj) => {
    return connection.getBookingCollection().then(bookModel => {
        return connection.getUserCollection().then(userModel => {

            return bookDB.generateId().then(bId => {
                bookObj.bookingId = bId;
                
                return bookModel.insertMany(bookObj).then(obj => {
                    if (obj) {
                        return userModel.updateOne({ userId: bookObj.userId }, { $push: { bookings: bookObj.bookingId } }).then(data => {
                            if (data.nModified > 0) {
                                return data;
                            } else {
                                return null
                            }
                        })
                    }
                    else {
                        return null
                    }
                })

            })

        })
    })
}


module.exports = bookDB;