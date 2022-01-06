const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupUser")
const userService = require('../service/userslogin')
const packagesService = require("../service/packages")
const hotDealsService = require("../service/hotdeals")
const bookService = require('../service/book');
const Booking = require('../model/beanClasses/booking');
const User = require('../model/beanClasses/users');

router.get("/setup", (req, res, next) => {
    setupUser.userSetup()
        .then((data) => {
            res.send(data)
        })
        .catch(err => {
            next(err)
        });
})

//router to login
router.post('/login', (req, res, next) => {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userService.login(parseInt(contactNo), password)
        .then((userDetails) => {

            res.json(userDetails);
        })
        .catch(err => {
            next(err)
        });
})

router.get('/packages/hotDeals', (req, res, next) => {
    hotDealsService.getHotDealsCollection()
        .then((hotDeals) => {
            res.json(hotDeals);
        })
        .catch((err) => {
            next(err)
        })
})

router.get('/packages/:destination', (req, res, next) => {
    let param_destination = req.params.destination
    let searchInput = param_destination[0].toUpperCase() + param_destination.slice(1)

    packagesService.getDestinationCollection(searchInput)
        .then((packages) => {
            res.json(packages);
        })
        .catch((err) => {
            next(err)
        })
})

router.post('/register', (req, res, next) => {
    let userObj = new User(req.body);
    userService.register(userObj)
        .then(data => {
            if (data == true) {
                res.json({ 'message': 'THANK YOU FOR REGISTERING WITH US!' });
            }
        })
        .catch(err => {
            next(err)
        })
})

router.post('/book/:destinationId', (req, res, next) => {
    let bookObj = new Booking(req.body);
    let destId = req.params.destinationId;
    bookObj.destId = destId;
    bookService.book(destId, bookObj).then(data => {
        res.json({ 'message': 'Booking Successfull for Destination Id'+ bookObj.destId });
    }).catch(error => {
        next(error)
    })
})

router.delete('/book/cancelBooking/:bookingId',(req,res,next)=>{
    let bookingId=req.params.bookingId;
    bookService.deleteBooking(bookingId).then(bId=>{
        res.json({'message':"Successfully deleted booking with BookingId: "+ bId })
    }).catch(err=>{
        next(err)
    })
})

router.get('/getDetails/:destinationId',(req,res,next)=>{
    let destId=req.params.destinationId;
    bookService.viewDestination(destId).then(arr=>{
        res.json(arr)
    }).catch(err=>next(err))
})

router.get('/getBookings/:userId',(req,res,next)=>{
    let userId=req.params.userId;
    userService.viewBookings(userId).then(arr=>{
        res.json(arr);
    }).catch(err=>next(err));
})

router.get('/getPackageNames',(req,res,next)=>{
    packagesService.getPackageNames().then(arr=>{
        res.json(arr);
    }).catch(err=>next(err));
})

module.exports = router