"use strict";

/*
    In a real system passengers would be qualified
    into the transit system as genuinely in
    need of the transit system assistance.
    This information would persist in a database.
    Their usual pickup and dropoff locations would persist
    and could pre-populate their request forms.
    Only admins can access passenger records.
    A log-in system would be required for
    passengers to access their own records.
 */


const find = require('lodash/find');
const forEach = require('lodash/forEach');
const remove = require('lodash/forEach');

const passengers = [];

function* generatePassengerId() {
    let value = 0;
    while(true) {
        yield value + 1;
    }
};


const newPassenger = (passenger) => {
    this.passengers.push(passenger);
};

const findPassengers = (predicate) => {
    return find(this.passengers, predicate);
};



