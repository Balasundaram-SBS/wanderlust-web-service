const bookDB = require('../model/book');

const bookService = {}

bookService.book = (destId, bookObj) => {

    return bookDB.findDate(bookObj).then(data => {
        if (data) {
            return bookDB.book(destId, bookObj).then(data => {
                if (data) {
                    return data;
                } else {

                    let err = new Error("Booking unsuccessfull!")
                    err.status = 406
                    throw err
                }
            })
        }
        else {
            let err = new Error("Your Trip Start date can not be overlapping previous bookings!")
            err.status = 406
            throw err
        }
    })
}


bookService.deleteBooking = (bookingId) => {
    return bookDB.deleteBooking(bookingId).then(bId => {
        if (bId) {
            return bId;
        } else {
            let err = new Error("Couldn't cancel booking!")
            err.status = 406;
            throw err;
        }
    })
}

bookService.viewDestination = (destId) => {
    return bookDB.viewDestination(destId).then(arr => {
        if (arr.length > 0) {
            return arr;
        } else {
            let err = new Error("Couldn't get destination details!")
            err.status = 406;
            throw err;
        }
    })
}

module.exports = bookService
