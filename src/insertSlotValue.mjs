// -*- coding: utf-8, tab-width: 2 -*-

const hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);


function trace(ss) { return ' @ ' + (ss.join(' → ') || 'top level'); }


const EX = function insertSlotValue(tpl, rgx, dict, opt, slotStack) {
  const freshRgx = new RegExp(rgx);
  // ^- Avoid bugs due to interwoven uses of .lastIndex.
  //    Not sure if the .replace() method is guaranteed to guard against
  //    this when using the same RegExp object in the replace function.
  //    For details, see https://stackoverflow.com/a/2141974 .
  return tpl.replace(freshRgx, function found(...m) {
    const [f] = m;
    const k = m[rgx.slot || 1];
    if (!k) {
      const e = ('Invalid slot name in marker ' + f + trace(slotStack));
      throw new Error(e);
    }
    if (!hasOwn(dict, k)) {
      const e = ('No replacement for slot ' + f + trace(slotStack));
      throw new Error(e);
    }
    if (slotStack.includes(k)) {
      const e = ('Recursive loop in slot ' + f + trace(slotStack));
      throw new Error(e);
    }
    return insertSlotValue(String(dict[k]), rgx, dict, opt, [...slotStack, k]);
  });
};


export default EX;
