// -*- coding: utf-8, tab-width: 2 -*-

const hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);


function trace(ss) { return ' @ ' + (ss.join(' → ') || 'top level'); }


function insertSlotValue(tpl, rgx, dict, slotStack) {
  const freshRgx = new RegExp(rgx);
  // ^- Avoid bugs due to interwoven uses of .lastIndex.
  //    Not sure if the .replace() method is guaranteed to guard against
  //    this when using the same RegExp object in the replace function.
  //    For details, see https://stackoverflow.com/a/2141974 .
  return tpl.replace(freshRgx, function found(...m) {
    const k = m[rgx.slot || 1];
    if (!k) {
      const e = ('Invalid slot name in marker ' + m[0] + trace(slotStack));
      throw new Error(e);
    }
    if (!hasOwn(dict, k)) {
      const e = ('No replacement for slot ' + m[0] + trace(slotStack));
      throw new Error(e);
    }
    if (slotStack.includes(k)) {
      const e = ('Recursive loop in slot ' + m[0] + trace(slotStack));
      throw new Error(e);
    }
    return insertSlotValue(String(dict[k]), rgx, dict, [...slotStack, k]);
  });
}


const EX = function simpleRecursiveTemplate(tpl, rgx, dict) {
  return insertSlotValue(tpl, rgx, dict || false, []);
};


export default EX;
