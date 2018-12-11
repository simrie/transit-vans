"use strict";

/*
    Passengers would need to be added to the system.
    Passengers could be linked to their own favorite
    locations (home, doctors, transit dropoff)
    and a callerId would enable them to make
    reservations via phone or phone app without
    requiring them to remember log-in credentials.
    They would have to be qualified as riders
    and upload their photo for driver verification.
 */

const id;
const name;
const locations = {}; // passenger usual locations (home, work, doctor)
const callerId;      // passengers can request rides by phone
const qualification; // elder, disabled, other
const photo;         // jpg, png or bitmap so driver can validate passenger

const passenger = {
    id,
    name,
    locations,
    callerId,
    qualification,
    photo
};

module.exports = passenger;

