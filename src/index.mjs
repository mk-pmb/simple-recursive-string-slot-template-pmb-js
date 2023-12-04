// -*- coding: utf-8, tab-width: 2 -*-

import insertSlotValue from './insertSlotValue.mjs';
import maybeReportUnused from './maybeReportUnused.mjs';


const EX = function simpleRecursiveTemplate(tpl, rgx, origDict, origOpt) {
  const dict = (origDict || false);
  const opt = { ...origOpt };
  if (opt.reportUnused) { opt.unusedSlots = new Set(Object.keys(dict)); }
  const text = insertSlotValue(tpl, rgx, dict, opt, []);
  maybeReportUnused(opt);
  return text;
};


export default EX;
