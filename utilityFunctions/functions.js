"use strict";

/*
    Random x, y generator
 */

const random = require('lodash/random');
const abs = Math.abs;
const sqrt = Math.sqrt;
const pow = Math.pow;
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

const calculateDistance = (loc1, loc2) => {
    const distance = 0;
    const xs = abs(loc1.x - loc2.x);
    const ys = abs(loc1.y - loc2.y);
    return sqrt(pow(xs, 2) + pow(ys, 2));
}

const functions = {
    idGenerator,
    randomXY,
    randomPassenger,
    randomInt,
    calculateDistance
};

module.exports = functions;
