"use strict";

/*
    Object definition for a ride
    Question:  should pickup location and destination
        all just be "location" objects?
 */


const ride = () => {
    return {
        rideId: 0,
        vanRunId: 0,
        origin: {},         //location object
        destination: {}    //location object
        /*
        wheelchairPassengerCount,   //int
        seatedPassengerCount,       //int
        baggageSpaceRequired,       //boolean
        primaryPassenger,       //passenger object
        requestedDropoffTime,   // long int
        assignedPickupTime,     // long int
        actualDropoffTime,      // long int
        */
    }
}

module.exports = ride;

