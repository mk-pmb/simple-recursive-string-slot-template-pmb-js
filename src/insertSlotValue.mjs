// -*- coding: utf-8, tab-width: 2 -*-

const hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);


function trace(ss) { return ' @ ' + (ss.join(' → ') || 'top level'); }

function fail(msg, matches, slotStack) {
  const slotName = matches[0];
  const err = new Error(msg + ' for slot ' + slotName + trace(slotStack));
  Object.assign(err, {
    matches,
    slotName,
    slotStack,
  });
  throw err;
}


const EX = function insertSlotValue(tpl, rgx, dict, opt, slotStack) {
  const freshRgx = new RegExp(rgx);
  // ^- Avoid bugs due to interwoven uses of .lastIndex.
  //    Not sure if the .replace() method is guaranteed to guard against
  //    this when using the same RegExp object in the replace function.
  //    For details, see https://stackoverflow.com/a/2141974 .
  return tpl.replace(freshRgx, function found(...m) {
    const k = m[rgx.slot || 1];
    if (!k) { fail('Invalid slot name', m, slotStack); }
    if (!hasOwn(dict, k)) { fail('No replacement', m, slotStack); }
    if (slotStack.includes(k)) { fail('Recursive loop', m, slotStack); }
    return insertSlotValue(String(dict[k]), rgx, dict, opt, [...slotStack, k]);
  });
};


export default EX;
