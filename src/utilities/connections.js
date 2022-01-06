const { Schema } = require("mongoose");
const Mongoose = require("mongoose")
Mongoose.Promise = global.Promise;
const url = "mongodb+srv://username:password@users.n97mm.mongodb.net/Wanderlust_DB?retryWrites=true&w=majority";

let userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bookings: {
        type: [String],
        required: true
    }
}, { collection: "Users" })


let bookingSchema = Schema({
    bookingId: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    destId: {
        type: String,
        required: true
    },
    destinationName: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    noOfPersons: {
        type: Number,
        required: true
    },
    totalCharges: {
        type: Number,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true,
        default: new Date
    }
}, { collection: "Bookings" })

let destinationSchema = Schema({
    destinationId: {
        type: String,
        required: true
    },
    continent: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        about: {
            type: String,
            required: true
        },
        itinerary: {
            dayWiseDetails:
            {
                firstDay: {
                    type: String,
                    required: true
                },
                restDaysSightSeeing: {
                    type: [String],
                    required: true
                },
                lastDay: {
                    type: String,
                    required: true
                }
            },
            packageInclusions: {
                type: [String],
                required: true
            },
            tourHighlights: {
                type: [String],
                required: true
            },
            tourPace: {
                type: [String],
                required: true
            }
        }
    },
    noOfNights: {
        type: Number,
        required: true
    }
    ,
    flightCharges: {
        type: Number,
        required: true
    },
    chargesPerPerson: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    availability: {
        type: Number,
        required: true
    }
}, { collection: "Destinations" })

let hotDealSchema = Schema({
    destinationId: {
        type: String,
        required: true
    },
    continent: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        about: {
            type: String,
            required: true
        },
        itinerary: {
            dayWiseDetails: {
                firstDay: {
                    type: String,
                    required: true
                },
                restDaysSightSeeing: {
                    type: [String],
                    required: true
                },
                lastDay: {
                    type: String,
                    required: true
                }
            },
            packageInclusions: {
                type: [String],
                required: true
            }
            ,
            tourHighlights: {
                type: [String],
                required: true
            },
            tourPace: {
                type: [String],
                required: true
            }
        }
    }
    ,
    noOfNights: {
        type: Number,
        required: true
    },
    flightCharges: {
        type: Number,
        required: true
    },
    chargesPerPerson: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    availability: {
        type: Number,
        required: true
    }

}, { collection: "HotDeals" })

let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Users', userSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getDestinationCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Destinations', destinationSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getBookingCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Bookings', bookingSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getHotDealsCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('HotDeals', hotDealSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

module.exports = collection;
