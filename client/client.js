'use strict';

import pogo, { alts, chan } from 'po-go';
import React, { Component } from 'react';
import Promise from 'bluebird';
import _ from 'lodash';
import { List } from 'immutable';
const sleep = Promise.delay;

class NumbersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: this.props.initialNumbers,
      scrolls: pogo.chan()
    };
  }

  render() {
    return <ul>{ this.state.numbers.map(n => <li>{n}</li>) }</ul>;
  }

  componentDidMount() {
    listen(window, 'scroll', this.state.scrolls);
    pogo(function*() {
      if (bottomGap() < 1000) yield* this.fetchNewNumbers();
      while (true) {
        yield this.state.scrolls;
        if (bottomGap() < 1000) yield* this.fetchNewNumbers();
      }
    }.bind(this));
  }

  *fetchNewNumbers() {
    const latestNumber = this.state.numbers.get(this.state.numbers.size - 1);
    const newNumbers = yield* getNumbers(latestNumber + 1, 50);
    this.setState({ numbers: this.state.numbers.concat(newNumbers) });
  }
}

function bottomGap() {
  return $(document).height() - $(window).height() - $(document).scrollTop();
}

function *getNumbers(offset, limit) {
  const results = yield $.getJSON("/numbers", { offset: offset, limit: limit });
  return results.map(r => r.value);
}

function listen(el, type, ch) {
  ch = ch || pogo.chan();
  el.addEventListener(type, e => ch.putAsync(e));
  return ch;
}

let tickCount = 0;

const clicks = listen(document, 'click');
let clickCount = 0;

const moves = listen(document, 'mousemove');
let moveCount = 0;

$(() => {
  React.render(<NumbersList initialNumbers={List(_.range(0, 10))} />,
               document.getElementById('numbers'));

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
});
