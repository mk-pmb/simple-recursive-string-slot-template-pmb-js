// -*- coding: utf-8, tab-width: 2 -*-

import test from 'p-tape';

import srt from '../src/index.mjs';

function err2str(f) { try { return f(); } catch (e) { return String(e); } }
function toSortedList(x) { return Array.from(x).sort(); }


test('Lunch', (t) => {
  t.plan(1);
  const tpl = ('I started lunch with %<appetizer>.'
    + ' Then I had %<mainDish>; and finally, %<dessert>.');
  const rgx = /%<(\w+)>/g;
  const dict = {
    appetizer: '%<defaultSalad>',
    defaultSalad: 'a %<saladBase> salad with some %<fruit>',
    saladBase: 'lettuce',
    fruit: 'strawberry slices',
    mainDish: '%<burgerOfTheDay>',
    burgerOfTheDay: ('a toasted milkbread bun loaded with tomato slices,'
      + ' a %<patty>, a %<cheese>, another %<patty>, another %<cheese>,'
      + ' some pickle slices and BBQ sauce'),
    patty: 'chicken filet',
    cheese: 'slice of cheddar',
    dessert: 'vanilla ice cream with %<fruit>',
  };
  const meal = srt(tpl, rgx, dict);
  t.equal(meal, 'I started lunch with a lettuce salad with some strawberry'
    + ' slices. Then I had a toasted milkbread bun loaded with tomato slices,'
    + ' a chicken filet, a slice of cheddar, another chicken filet, another'
    + ' slice of cheddar, some pickle slices and BBQ sauce; and finally,'
    + ' vanilla ice cream with strawberry slices.');
});


test('Missing slot', (t) => {
  t.plan(3);
  const tpl = 'Oh noes, I accidentially #verb the whole bottle.';
  const rgx = /#\w+/g;
  const errNoRep = 'Error: No replacement for slot #verb @ top level';
  t.equal(err2str(() => srt(tpl, rgx)), errNoRep);

  const dict = { verb: undefined };
  t.same(Object.keys(dict), ['verb']);
  t.equal(err2str(() => srt(tpl, rgx, dict)), errNoRep);
});


test('How a fork bomb works', (t) => {
  t.plan(1);
  const tpl = 'A fork bomb is a &proc;.';
  const rgx = /\&(\w+);/g;
  const dict = {
    proc: 'process that &task1; and then &task2;',
    task1: 'starts a &proc;',
    task2: 'starts another &proc;',
  };
  const msg = err2str(() => srt(tpl, rgx, dict));
  t.equal(msg, 'Error: Recursive loop for slot &proc; @ proc → task1');
});


test('reportUnused', (t) => {
  t.plan(10);
  const tpl = ('SELECT name, icon FROM users WHERE uid = %userId'
    + ' AND level >= %minLv AND level <= %maxLv');
  const rgx = /%(\w+)/g;
  const dict = { userId: 23, groupId: 42, minLv: 1, maxLv: 99, banned: false };
  const opt = { reportUnused: 'error' };
  const msg1 = err2str(() => srt(tpl, rgx, dict, opt));
  t.equal(msg1, 'Error: Unused slots: banned, groupId');
  t.same(Object.keys(opt), ['reportUnused']);

  const wantText = ('SELECT name, icon FROM users WHERE uid = 23'
    + ' AND level >= 1 AND level <= 99');

  const rUnSet = new Set();
  opt.reportUnused = rUnSet;
  t.equal(srt(tpl, rgx, dict, opt), wantText);
  t.equal(opt.reportUnused, rUnSet);
  t.same(Object.keys(opt), ['reportUnused']);
  t.same(toSortedList(rUnSet), ['banned', 'groupId']);

  const rUnArray = [];
  opt.reportUnused = rUnArray;
  t.equal(srt(tpl, rgx, dict, opt), wantText);
  t.equal(opt.reportUnused, rUnArray);
  t.same(Object.keys(opt), ['reportUnused']);
  t.same(rUnArray.sort(), ['banned', 'groupId']);
});












console.info('+OK usage test passed.');
