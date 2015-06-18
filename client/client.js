'use strict';

const pogo = require('./pogo');
const Promise = require('bluebird');
const sleep = Promise.delay

pogo(function*() {
  while (true) {
    console.log("tick");
    yield sleep(1000);
    console.log("tock");
    yield sleep(1000);
  }
}).then(v => console.log("v", v), e => console.log("e", e));
