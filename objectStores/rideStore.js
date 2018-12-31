"use strict";

/*
    Singleton to store ride objects.
    In a real system this would be replaced
    by a persistent external database.
 */

const find = require('lodash/find');
const forEach = require('lodash/forEach');
const remove = require('lodash/forEach');
const utilfs = require('../utilityFunctions/functions');
const rideObject = require('../objectClasses/ride');
const locationStore = require('./locationStore');
//const locationStore = require('locationStore');

const rides = [];
const ridesCompleted = [];
const idGen = utilfs.idGenerator();

const createRide = (origin=null, destination=null, passenger='terminus') => {
    const ride = rideObject();
    const name = passenger; //string
    ride.origin = origin; //location object
    ride.destination = destination; //location object
    return addRide(ride);
};

const createRides = (n, maxX, maxY) => {
    const rides = [];
    for (var i = 0; i < n; i++) {
        const ride = rideObject();
        const name = utilfs.randomPassenger();
        ride.origin = locationStore.newRandomLocation(name, maxX, maxY);
        ride.destination = locationStore.randomWellKnownLocation();
        rides.push(addRide(ride));
    };
    return rides;
};

const addRide = (newRide) => {
    //newRide.rideId = generateRideId().next().value;
    newRide.rideId = idGen.next().value;
    rides.push(newRide);
    return newRide;
};

const findRides = (predicate) => {
    return find(this.riders, predicate);
};

const completeRides = (predicate) => {
    // Remove ride(s) from rides[]
    // Add ride(s) to ridesCompleted[]
    const rides = remove(this.rides, predicate);
    forEach(rides, (ride) => {
        this.ridesCompleted.push(ride);
    });
};

const testLocationStore = () => {
    console.log(locationStore.wellKnownLocations);
};

const rideStore = (() => {
    //createRides(10, 40, 40);
    return {
        rides,
        ridesCompleted,
        addRide,
        createRide,
        createRides,
        findRides,
        completeRides,
        testLocationStore
    }
})();

module.exports = rideStore;

