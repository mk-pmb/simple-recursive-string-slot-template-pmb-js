// -*- coding: utf-8, tab-width: 2 -*-

import insertSlotValue from './insertSlotValue.mjs';


const EX = function simpleRecursiveTemplate(tpl, rgx, origDict, origOpt) {
  const dict = (origDict || false);
  const opt = { ...origOpt };
  const text = insertSlotValue(tpl, rgx, dict, opt, []);
  return text;
};


export default EX;
