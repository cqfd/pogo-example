'use strict';

import pogo, { alts, chan } from './pogo';
import Promise from 'bluebird';
const sleep = Promise.delay;

function listen(el, type) {
  const ch = pogo.chan(1);
  el.addEventListener(type, e => ch.putAsync(e));
  return ch;
}

let tickCount = 0;

const clicks = listen(document, 'click');
let clickCount = 0;

const moves = listen(document, 'mousemove');
let moveCount = 0;

$(() => {
  const msgEl = document.getElementById('msg');

  pogo(function*() {
    while (true) {
      const r = yield alts([sleep(1000), clicks, moves]);
      if (r === undefined) {
        tickCount += 1;
        msgEl.innerHTML = "ticks: " + tickCount;
      } else if (r.channel === clicks) {
        clickCount += 1;
        msgEl.innerHTML = "clicks: " + clickCount;
      } else {
        moveCount += 1;
        msgEl.innerHTML = "moves: " + moveCount;
      }
    }
  }).then(v => console.log("v", v), e => console.log("e", e));

  pogo(function*() {
    while (true) {
      console.log("I'm running too :)");
      yield sleep(1000);
    }
  });

});
