import {
  closeConnection,
  UserModel,
  BusServiceModel,
  LocationModel,
  ReservationModel,
} from "./db.js";

//delete all documents in DB
await ReservationModel.deleteMany();
console.log("Deleted Reservation Entries");
await UserModel.deleteMany();
console.log("Deleted Users Entries");
await BusServiceModel.deleteMany();
console.log("Deleted BusService Entries");
await LocationModel.deleteMany();
console.log("Deleted Location Entries");

// Locations
const allLocations = [
  {
    Name: "South Bank",
    Address: "40 Melbourne St, Southbank QLD 4101",
    Directions:
      "Cultural Center Bus Station on the corner of Melbourne St and Grey St",
  },
  {
    Name: "Toowong",
    Address: "3 Sherwood Rd, Toowong QLD 4066",
    Directions: "Stop 23 on Sherwood Rd, near High St at Toowong Village",
  },
  {
    Name: "The Gabba",
    Address: "Vulture St, Woolloongabba QLD 4102",
    Directions: "Stop 23 on Sherwood Rd, near High St at Toowong Village",
  },
  {
    Name: "Suncorp Stadium",
    Address: "40 Castlemaine St, Milton QLD 4064",
    Directions: "Drop off point at 40 Castlemaine St",
  },
  {
    Name: "Queensland Tennis Center",
    Address: "40 Castlemaine St, Milton QLD 4064",
    Directions: "Drop off point at 40 Castlemaine St",
  },
];
// add locations to db
const locationResponse = await LocationModel.insertMany(allLocations);
console.log("Inserted Location Entries");

// Users
const users = [
  {
    Name: "Test Administrator",
    Email: "admin@example.com",
    Password_Hash: "admin1234",
    DOB: new Date(1995, 3, 12),
    Is_admin: true,
    Reservations: [],
  },
  {
    Name: "Test User",
    Email: "user@example.com",
    Password_Hash: "123456",
    DOB: new Date(1990, 8, 20),
    Is_admin: false,
    Reservations: [],
  },
  {
    Name: "Frodo Baggins",
    Email: "frodo@LOTR.com",
    Password_Hash: "123456",
    DOB: new Date(1965, 1, 1),
    Is_admin: false,
    Reservations: [],
  },
];
// add users to db
const userResponse = await UserModel.insertMany(users);

// Services
// Date range 23 July - 8 August
const services = [
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 7, 30),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[0]._id,
    DropoffLocation: locationResponse[4]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 8, 30),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[0]._id,
    DropoffLocation: locationResponse[4]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 9, 30),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[0]._id,
    DropoffLocation: locationResponse[4]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 10, 30),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[0]._id,
    DropoffLocation: locationResponse[4]._id,
    Reservations: [],
  },

  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 11, 30),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[0]._id,
    DropoffLocation: locationResponse[4]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 8, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[4]._id,
    DropoffLocation: locationResponse[0]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 9, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[4]._id,
    DropoffLocation: locationResponse[0]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 10, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[4]._id,
    DropoffLocation: locationResponse[0]._id,
    Reservations: [],
  },
  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 11, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[4]._id,
    DropoffLocation: locationResponse[0]._id,
    Reservations: [],
  },

  {
    EventName: "Tennis",
    CollectionTime: new Date(2032, 7, 23, 12, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[4]._id,
    DropoffLocation: locationResponse[0]._id,
    Reservations: [],
  },
  {
    EventName: "Track and field",
    CollectionTime: new Date(2032, 7, 24, 10, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[1]._id,
    DropoffLocation: locationResponse[2]._id,
    Reservations: [],
  },
  {
    EventName: "Track and field",
    CollectionTime: new Date(2032, 7, 24, 11, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[2]._id,
    DropoffLocation: locationResponse[1]._id,
    Reservations: [],
  },
  {
    EventName: "Footbal Finals",
    CollectionTime: new Date(2032, 7, 30, 17, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[1]._id,
    DropoffLocation: locationResponse[3]._id,
    Reservations: [],
  },
  {
    EventName: "Footbal Finals",
    CollectionTime: new Date(2032, 7, 30, 19, 0),
    EstimatedTravelTime: "30",
    Capacity: 40,
    PickupLocation: locationResponse[3]._id,
    DropoffLocation: locationResponse[1]._id,
    Reservations: [],
  },
];

const serviceResponce = await ServiceModel.insertMany(services);
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
        user : userResponse[3]._id,
        busService : serviceResponce[12]._id
    },
]
const revervationResponce = await ReservationModel.insertMany(reservations);
for (reservation of reservationsResponce){
    UserModel.update(
        { _id: reservation.user }, 
        { $push: { Reservations: reservation._id } },
        done
    );
    BusServiceModel.update(
        { _id: reservation.busService }, 
        { $push: { Reservations: reservation._id } },
        done
    );
}
console.log("Inserted Reservations");

closeConnection();
