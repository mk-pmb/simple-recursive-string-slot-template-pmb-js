// -*- coding: utf-8, tab-width: 2 -*-

function fail(msg) { throw new Error(msg); }


const EX = function maybeReportUnused(opt) {
  const unOpt = opt.reportUnused;
  if (!unOpt) { return; }
  const unSet = opt.unusedSlots;
  if (!unSet.size) { return; }
  const unList = Array.from(unSet).sort();
  if (unOpt === 'error') { fail('Unused slots: ' + unList.join(', ')); }
  if (unOpt.add) { return unSet.forEach(v => unOpt.add(v)); }
  if (unOpt.push) { return unSet.forEach(v => unOpt.push(v)); }
  fail('Unsupported value for option reportUnused!');
};


export default EX;
