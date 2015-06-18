'use strict';

import pogo, { alts, chan } from './pogo';
import Promise from 'bluebird';
const sleep = Promise.delay;

function listen(el, type) {
  const ch = pogo.chan();
  el.addEventListener(type, e => ch.putAsync(e));
  return ch;
}

$(() => {
  const clicks = listen(document, 'click');
  pogo(function*() {
    const msgEl = document.getElementById('msg');
    let timeSinceLastClick = 0;
    while (true) {
      const r = yield alts([clicks, sleep(1000)]);
      if (r === undefined) {
        timeSinceLastClick += 1;
        msgEl.innerHTML = timeSinceLastClick;
      }
      else {
        timeSinceLastClick = 0;
        msgEl.innerHTML = r.value.screenX + " " + r.value.screenY;
      }
    }
  }).then(v => console.log("v", v), e => console.log("e", e));
});
