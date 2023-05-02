
<!--#echo json="package.json" key="name" underline="=" -->
simple-recursive-string-slot-template-pmb
==========================================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
In your template string, replace all slot (marked by a custom regexp) with
string values from your dictionary object, even recursively, but avoiding
loops.
<!--/#echo -->



API
---

This module exports one function:

### simpleRecursiveTemplate(tpl, rgx, dict)

* `tpl` is your initial template string.
* `rgx` is a slot marker regexp.
  The slot name is what the regexp matches as group 1.
  If you want to match a different group, assign its number to the
  `.slot` property of your regexp.
  (You cannot use slot 0. Just add parens around your entire regexp.)
  * Usually you want your regexp to have the `g` flag.
  * The empty string is not a valid slot name.
* `dict` is an object that maps slot names to string values.
  The latter may be partial templates, i.e. contain further slot markers.




Usage
-----

see [test/usage.mjs](test/usage.mjs)


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
