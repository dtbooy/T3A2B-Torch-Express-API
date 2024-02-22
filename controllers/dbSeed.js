import bcrypt from "bcrypt"
const salt = 10

import {
  User,
  BusService,
  Location,
  Reservation,
  closeConnection
} from "../db.js";

//delete all documents in DB
await Reservation.deleteMany();
console.log("Deleted Reservation Entries");
await User.deleteMany();
console.log("Deleted Users Entries");
await BusService.deleteMany();
console.log("Deleted BusService Entries");
await Location.deleteMany();
console.log("Deleted Location Entries");

// Locations
const allLocations = [
  {
    name: "South Bank",
    address: "40 Melbourne St, Southbank QLD 4101",
    directions:
      "Cultural Center Bus Station on the corner of Melbourne St and Grey St",
  },
  {
    name: "Toowong",
    address: "3 Sherwood Rd, Toowong QLD 4066",
    directions: "Stop 23 on Sherwood Rd, near High St at Toowong Village",
  },
  {
    name: "The Gabba",
    address: "Vulture St, Woolloongabba QLD 4102",
    directions: "Stop 23 on Sherwood Rd, near High St at Toowong Village",
  },
  {
    name: "Suncorp Stadium",
    address: "40 Castlemaine St, Milton QLD 4064",
    directions: "Drop off point at 40 Castlemaine St",
  },
  {
    name: "Queensland Tennis Center",
    address: "40 Castlemaine St, Milton QLD 4064",
    directions: "Drop off point at 40 Castlemaine St",
  },
];
// add locations to db
const locationResponse = await Location.insertMany(allLocations);
console.log("Inserted Location Entries");

// Users
const users = [
  {
    name: "Test Administrator",
    email: "admin@example.com",
    password: "admin1234",
    DOB: new Date(1995, 3, 12),
    is_admin: true,
    reservations: [],
  },
  {
    name: "Test User",
    email: "user@example.com",
    password: "123456",
    DOB: new Date(1990, 8, 20),
    is_admin: false,
    reservations: [],
  },
  {
    name: "Frodo Baggins",
    email: "frodo@LOTR.com",
    password: "123456",
    DOB: new Date(1965, 1, 1),
    is_admin: false,
    reservations: [],
  },
];

//hash dummy data using for each
// need to create a function to 
const hashedUsers = []
users.forEach(async user => {
  const hashedPassword = bcrypt.hashSync(user.password, salt)
  hashedUsers.push({
    ...user,
    password: hashedPassword
  })
})

//wait for all users to get hashed
await Promise.all(hashedUsers)

// add users to db
const userResponse = await User.insertMany(hashedUsers)


// Services
// Date range 23 July - 8 August
const services = [
  {
    
    busNumber: 1,
    collectionTime: new Date(2032, 7, 23, 7, 30),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[0]._id,
    dropoffLocation: locationResponse[4]._id,
    reservations: [],
  },
  {
    
    busNumber: 2,
    collectionTime: new Date(2032, 7, 23, 8, 30),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[0]._id,
    dropoffLocation: locationResponse[4]._id,
    reservations: [],
  },
  {
    
    busNumber: 3,
    collectionTime: new Date(2032, 7, 23, 9, 30),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[0]._id,
    dropoffLocation: locationResponse[4]._id,
    reservations: [],
  },
  {
    
    busNumber: 4,
    collectionTime: new Date(2032, 7, 23, 10, 30),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[0]._id,
    dropoffLocation: locationResponse[4]._id,
    reservations: [],
  },

  {
    
    busNumber: 5,
    collectionTime: new Date(2032, 7, 23, 11, 30),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[0]._id,
    dropoffLocation: locationResponse[4]._id,
    reservations: [],
  },
  {
    
    busNumber: 6,
    collectionTime: new Date(2032, 7, 23, 8, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[4]._id,
    dropoffLocation: locationResponse[0]._id,
    reservations: [],
  },
  {
    
    busNumber: 7,
    collectionTime: new Date(2032, 7, 23, 9, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[4]._id,
    dropoffLocation: locationResponse[0]._id,
    reservations: [],
  },
  {
    
    busNumber: 8,
    collectionTime: new Date(2032, 7, 23, 10, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[4]._id,
    dropoffLocation: locationResponse[0]._id,
    reservations: [],
  },
  {
    
    busNumber: 9,
    collectionTime: new Date(2032, 7, 23, 11, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[4]._id,
    dropoffLocation: locationResponse[0]._id,
    reservations: [],
  },

  {
    
    busNumber: 10,
    collectionTime: new Date(2032, 7, 23, 12, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[4]._id,
    dropoffLocation: locationResponse[0]._id,
    reservations: [],
  },
  {
    
    busNumber: 11,
    collectionTime: new Date(2032, 7, 24, 10, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[1]._id,
    dropoffLocation: locationResponse[2]._id,
    reservations: [],
  },
  {
    
    busNumber: 12,
    collectionTime: new Date(2032, 7, 24, 11, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[2]._id,
    dropoffLocation: locationResponse[1]._id,
    reservations: [],
  },
  {
    
    busNumber: 13,
    collectionTime: new Date(2032, 7, 30, 17, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[1]._id,
    dropoffLocation: locationResponse[3]._id,
    reservations: [],
  },
  {
    
    busNumber: 14,
    collectionTime: new Date(2032, 7, 30, 19, 0),
    estimatedTravelTime: "30",
    capacity: 40,
    pickupLocation: locationResponse[3]._id,
    dropoffLocation: locationResponse[1]._id,
    reservations: [],
  },
];

const serviceResponce = await BusService.insertMany(services);
console.log("Inserted Services");

const reservations = [
    {
        user : userResponse[0]._id,
        busService : serviceResponce[0]._id
    },
    {
        user : userResponse[0]._id,
        busService : serviceResponce[9]._id
    },
    {
        user : userResponse[1]._id,
        busService : serviceResponce[11]._id
    },
    {
        user : userResponse[2]._id,
        busService : serviceResponce[11]._id
    },
    {
        user : userResponse[2]._id,
        busService : serviceResponce[10]._id
    },
    {
        user : userResponse[0]._id,
        busService : serviceResponce[12]._id
    },
]
const reservationsResponce = await Reservation.insertMany(reservations);
for (const reservation of reservationsResponce){
    await User.findOneAndUpdate(
        // The query object
        { _id: reservation.user }, 
        // The data we want to append to the array property of the found document
        { $push: { reservations: reservation._id } }  
    ).exec();
    await BusService.findOneAndUpdate(
        { _id: reservation.busService }, 
        { $push: { reservations: reservation._id } }
    ).exec();
}
console.log("Inserted Reservations");

closeConnection()
console.log("Disconnected");
