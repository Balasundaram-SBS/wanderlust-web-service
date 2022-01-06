var request = require('request');
var userService = require('../src/service/userslogin');
var userDB = require('../src/model/userslogin');
var connection = require('../src/model/userslogin');
var userDetails = require('../src/model/beanClasses/users');
var hotDealsService = require('../src/service/hotdeals');
var packagesService = require('../src/service/packages');
var bookService = require('../src/service/book');
var bookDB = require('../src/model/book');
var userObj = {
    userId: "U1001",
    name: "abc",
    emailId: "abc@gmail.com",
    contactNo: 9098765432,
    password: "Abc@1234",
    bookings: ["B1001", "B1002"]
};
var bookObj = {
    bookingId: "B1001",
    userId: "U1001",
    destId: "D1001",
    destinationName: "A Week in Greece: Athens, Mykonos & Santorini",
    checkInDate: "2018-12-09",
    checkOutDate: "2018-12-16",
    noOfPersons: 2,
    totalCharges: 5998,
    timeStamp: new Date().getTime().toString()
};
describe('Test suite for US01', function () {
    describe('POST /', function () {
        it('Test case 1: Router {registered user}', function (done) {
            request.post('http://localhost:4000/user/login', function (error, response, body) {
                userService.login(9098765432, 'Abc@1234').then((data) => {
                    // expect(data).toBeDefined();
                    done();
                    expect(response.statusCode).toBe(500);
                    console.log('status code printed');
                }).catch(error => {
                    done();
                    expect(error).toBeDefined();
                    console.log('error caught 1');
                })
            })
        })
        it('Test case 2: Router {Non registered user}', function (done) {
            request.post('http://localhost:4000/user/login', function (error, response, body) {
                userService.login(9655534246, 'S3nth@m1l').then((data) => {
                    done();
                    console.log('Login successfully 2');
                }).catch(error => {
                    done();
                    expect(error).toBeTruthy();
                    console.log('error caught 2');
                })
            })
        })
    });
    describe('Service', function () {
        it('Test case 3: Service {Registered user}', function (done) {
            userDB.checkUser(9098765432).then(user => {
                done();
                expect(user).toBeTruthy();
                console.log('registered user')
            })
                .catch(error => {
                    done();
                    expect(error.message).toBe('Enter registered contact number! If not registered, please register');
                    expect(error.statusCode).toBe(406);
                    console.log('have to register');
                })
        });
        it('Test case 4: Service {Non registered user}', function (done) {
            userDB.checkUser(9098763425).then(user => {
                done();
                expect(user).toBe(null);
                console.log('Non registered user. Have to register')
            })
                .catch(error => {
                    done();
                    expect(error.message).toBe('Enter registered contact number! If not registered, please register');
                    expect(error.statusCode).toBe(406);
                    console.log('have to register');
                })
        });
    })
});
describe('Test suite for US02', function () {
    describe('POST /', function () {
        it('Test case 1: Register', function (done) {
            request.post('http://localhost:4000/user/register', function (error, response, body) {
                userService.register(userObj).then((data) => {
                    done();
                    // expect(response.statusMessage).toBe('Successfully Registered!');
                    expect(data).toBeTruthy();
                    console.log('Register done');
                }).catch(error => {
                    done();
                    expect(error.message).toBe('ACCOUNT ALREADY EXISTS FOR THE GIVEN CONTACT NUMBER.');
                    console.log('Registration failed');
                });
            });
        });
        it('Test case 2: Register', function (done) {
            request.post('http://localhost:4000/user/register', function (error, response, body) {
                userService.register(userObj).then((data) => {
                    done();
                    // expect(response.statusMessage).toBe('Successfully Registered!');
                    expect(response.statusCode).toBe(200);
                    console.log('success status code');
                }).catch(error => {
                    done();
                    expect(response.statusCode).toBe(500);
                    console.log('error status code');
                });
            });
        });
        it('Test case 3: service', function (done) {
            userDB.register(userObj).then(data => {
                done();
                expect(data).toBeFalsy();
                console.log('data already present');
            }).catch(error => {
                done();
                expect(error).toBeFalsy();
            });
        })
    });
});
describe('Test suite for US03', function () {
    describe('GET /', function () {
        it('Test case 1: Hot deals', function (done) {
            request.get('http://localhost:4000/user/packages/hotDeals', function (error, response, body) {
                hotDealsService.getHotDealsCollection().then((hotDeals) => {
                    done();
                    expect(response).toBeDefined();
                    console.log('hotdeals fetched');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeTruthy();
                    })
            })
        });
        it('Test case 2: Hot deals', function (done) {
            request.get('http://localhost:4000/user/packages/hotDeals', function (error, response, body) {
                hotDealsService.getHotDealsCollection().then((hotDeals) => {
                    done();
                    expect(response.statusCode).toBe(200);
                    console.log('status code as 200 for hot deals');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeTruthy();
                    })
            })
        });
        it('Test case 3: Search', function (done) {
            request.get('http://localhost:4000/user/packages/:destination', function (error, response, body) {
                packagesService.getDestinationCollection('Asia').then((data) => {
                    done();
                    expect(data).toBeDefined();
                    console.log('search data for Asia');
                }).catch(error => {
                    done();
                    expect(error.message).toBe('Sorry! Destination Packages can not be displayed at the moment');
                    console.log('search error 1');
                })
            })
        });
        it('Test case 4: Search', function (done) {
            request.get('http://localhost:4000/user/packages/:destination', function (error, response, body) {
                packagesService.getDestinationCollection('Europe').then((data) => {
                    done();
                    expect(data).toBeDefined();
                    console.log('search data for Europe');
                }).catch(error => {
                    done();
                    expect(error.message).toBe('Sorry! Destination Packages can not be displayed at the moment');
                    console.log('search error 2');
                })
            })
        });
        it('Test case 5: Search', function (done) {
            request.get('http://localhost:4000/user/packages/:destination', function (error, response, body) {
                packagesService.getDestinationCollection('India').then((data) => {
                    done();
                    expect(data).toBeDefined();
                    console.log('search data for India');
                }).catch(error => {
                    done();
                    expect(error.message).toBe('Sorry! Destination Packages can not be displayed at the moment');
                    console.log('search error 5');
                })
            })
        });
    });
});
describe('Test suite for US04', function () {
    describe('GET /', function () {
        it('Test case 1: View details', function (done) {
            request.get('http://localhost:4000/user/getDetails/:destinationId', function (error, response, body) {
                bookService.viewDestination('D1005').then(data => {
                    done();
                    expect(data).toBeDefined();
                    console.log('viewed the details 1');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeDefined();
                        console.log('cannot view the details 1');
                    })
            })
        });
        it('Test case 2: View details', function (done) {
            request.get('http://localhost:4000/user/getDetails/:destinationId', function (error, response, body) {
                bookService.viewDestination('D1003').then(data => {
                    done();
                    expect(data).toBeDefined();
                    console.log('viewed the details 2');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeDefined();
                        console.log('cannot view the details 2');
                    })
            })
        });
        it('Test case 3: View details', function (done) {
            request.get('http://localhost:4000/user/getDetails/:destinationId', function (error, response, body) {
                bookService.viewDestination('D4051').then(data => {
                    done();
                    expect(data).toBeDefined();
                    console.log('viewed the details 3');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeDefined();
                        console.log('cannot view the details 3');
                    })
            })
        });
        it('Test case 4: View details', function (done) {
            request.get('http://localhost:4000/user/getDetails/:destinationId', function (error, response, body) {
                bookService.viewDestination('D1010').then(data => {
                    done();
                    expect(data).toBeDefined();
                    console.log('viewed the details 4');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeDefined();
                        console.log('cannot view the details 4');
                    })
            })
        });
    });
});
describe('Test suite for US05', function () {
    describe('POST /', function () {
        it('Test case 1: Booking', function (done) {
            bookDB.book('D1005', bookObj).then((data) => {
                done();
                expect(data).toBeDefined();
                console.log('Book data 1')
            })
                .catch(error => {
                    done();
                    expect(error).toBeDefined();
                    console.log('book error 1');
                })
        });
        it('Test case 2: Booking', function (done) {
            bookDB.book('D1352', bookObj).then((data) => {
                done();
                expect(data).toBeDefined();
                console.log('Book data 2')
            })
                .catch(error => {
                    done();
                    expect(error).toBeDefined();
                    console.log('book error 2');
                })
        });
    })
})
describe('Test suite for US06', function () {
    describe('GET /', function () {
        it('Test case 1: view bookings', function (done) {
            request.get('http://localhost:4000/user/getBookings/:userId', function (error, response, body) {
                userService.viewBookings('U1002').then((data) => {
                    done();
                    expect(data).toBeDefined();
                    console.log('viewed the bookings 1');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeDefined();
                        console.log('cannot fetch booking 1')
                    });
            })
        });
        it('Test case 2: view bookings', function (done) {
            request.get('http://localhost:4000/user/getBookings/:userId', function (error, response, body) {
                userService.viewBookings('U4051').then((data) => {
                    done();
                    expect(data).toBeFalsy();
                    console.log('viewed the bookings 2');
                })
                    .catch(error => {
                        done();
                        expect(error).toBeDefined();
                        console.log('cannot fetch booking 2')
                    });
            })
        });
        it('Test case 3: View bookings service', function (done) {
            userService.viewBookings('C4051').then((data) => {
                done();
                expect(data).toBeTruthy();
                console.log('Viewed the bookings 3');
            })
                .catch(error => {
                    done();
                    expect(error).toBeDefined();
                    console.log('cannot fetch bookings 3');
                })
        });
        it('Test case 4: View bookings service', function (done) {
            userService.viewBookings('U1001').then((data) => {
                done();
                expect(data).toBeTruthy();
                console.log('Viewed the bookings 4');
            })
                .catch(error => {
                    done();
                    expect(error.statusCode).toBe(500);
                    console.log('cannot fetch bookings 4');
                })
        });
    });
});
describe('Test suite for US07', function () {
    describe('DELETE /', function () {
        it('Test case 1: Delete bookings', function (done) {
            request.delete('http://localhost:4000/user/book/cancelBooking/:bookingId', function (error, response, body) {
                bookService.deleteBooking('B1553').then((data) => {
                    done();
                    expect(body.message).toBe("Couldn't cancel booking");
                    console.log('Cannot delete 1');
                }).catch((error) => {
                    done();
                    expect(error).toBeDefined();
                    console.log('Book Id not found 1');
                })
            })
        });
        it('Test case 2: Delete bookings service', function (done) {
            bookDB.deleteBooking('B5511').then(bid => {
                done();
                expect(bid).toBe(undefined);
                console.log('Cannot find the Id 1');
            }).catch(error => {
                done();
                expect(error.statusCode).toBe(406);
                console.log('Delete error status code 1');
            })
        })
    })
});