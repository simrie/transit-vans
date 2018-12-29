"use strict";

/*
    Random x, y generator
 */

const random = require('lodash/random');
const faker = require('faker');

const randomPassenger = () => {
    return faker.name.firstName() + ' ' + faker.name.lastName();
}

const randomXY = (xMax, yMax) => {
    const x = random(1, xMax-1);
    const y = random(1, yMax-1);
    return { x, y };
}

const randomInt = (min, max) => {
    return random(min, max);
}

function* idGenerator () {
    let value = 0;
    while(true) {
        value = value + 1;
        yield value;
    }
}

const functions = {
    idGenerator,
    randomXY,
    randomPassenger,
    randomInt
};

module.exports = functions;
