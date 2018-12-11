"use strict";

/*
    Object definition for locations
    Public object are well-known destinations
    anyone can travel to, settable only by the system.
    Non-public destinations are private passenger
    locations such as home address.
 */

const locationStore = require('./../vanRouter/locationStore');
const visible = false;

// store phonetics for use with voice reservation system
// allow userRecorded only for non-public locations
const phonetics = {
    userRecorded: null,
    en: null,
    sp: null
};

const location = () => {
     return {
        id: 0,
        name: '',
        phonetics: {},
        x: 0,
        y: 0,
        visible
    }
};

module.exports = location;