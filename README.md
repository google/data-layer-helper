# Data Layer Helper Library
This library provides the ability to process messages passed onto a data layer queue.

- [Quick Start](#quick-start)
- [Background](#what-is-a-data-layer-queue)
- [Why Do We Need a Library?](#why-do-we-need-a-library)
- [The Abstract Data Model](#the-abstract-data-model)
    - [Overwriting Existing Values](#overwriting-existing-values)
    - [Recursively Merging Values](#recursively-merging-values)
    - [Preventing Default Recursive Merge](#preventing-default-recursive-merge)
    - [Meta Commands](#meta-commands)
    - [Native Methods](#native-methods)
    - [Custom Methods](#custom-methods)
        - [The Abstract Data Model Interface](#the-abstract-data-model-interface)
- [Listening for Messages](#listening-for-messages)
   - [With a Listener Function](#with-a-listener-function)
        - [Listening to the Past](#listening-to-the-past)
    - [By Registering Processors](#by-registering-processors)
        - [Delaying Processing](#delaying-processing)
- [Summary](#summary)
- [Build and Test](#build-and-test)
- [License](#license)
  

## Quick Start
First, install the package with your favorite package manager:
```bash
npm install data-layer-helper
// or
yarn add data-layer-helper
```

Next, import the code into your javascript:
```js
import 'node_modules/data-layer-helper/dist/data-layer-helper';
```

For the development version (bigger file size, but reports possible errors to the console):
```js
import 'node_modules/data-layer-helper/dist/data-layer-helper-test-debug';
```

## What is a Data Layer Queue?
A data layer queue is simply a JavaScript array that lives on a webpage. 

```html
<script>
  dataLayer = [];
</script>
```

Page authors can append messages onto the queue in order to emit information about the page and 
its state. 

```html
<script>
  dataLayer.push({
    title: "Migratory patterns of ducks",
    category: "Science",
    author: "Bradley Wogulis"
  });
</script>
```

These messages are simply JavaScript objects containing a hierarchy of key/value pairs. They can 
be metadata about the page content, information about the visitor, or data about events happening 
on the page. This system allows tools like analytics libraries and tag management systems to access 
this data in a standard way, so page authors can avoid using a bunch of proprietary, repetitive APIs.

* It provides a common, well defined system for exposing page data.
* It doesn't slow down page rendering.
* It doesn't pollute the global JavaScript namespace.
* It doesn't require page authors to learn a different, one-off API for every new tool.
* It doesn't require page authors to expose the same data multiple times.
* It allows page authors to add, remove or change vendors easily.

## Why do we need a Library?
The data layer system makes things very easy for page authors. The syntax is simple, and there's no
extra code to load. But this system _does_ make life a little more difficult for vendors and tools
that want to consume the data. That's where this library comes in. 

This project provides the ability to listen for data layer messages and to read the key/value pairs 
that have been set by all the previous messages. It can be used by the tools/vendors mentioned above, 
or by page authors that need to read back the data they've emitted.

To use this library, you'll need to get it onto the page. The easiest way to do this
is by [following these instructions.](#quick-start)
Once it's on the page, you can create a new helper object like this:

```js
const helper = new DataLayerHelper(dataLayer);
```

This helper object will listen for new messages on the given data layer.  Each new message will be 
merged into the helper's **"abstract data model"**.  This internal model object holds the most recent
value for all keys which have been set on messages processed by the helper. 

You can retrieve values from the data model by using the helper's `get()` method:

```js
helper.get('category');   // Returns "Science".
```

As mentioned above, messages passed onto the data layer can be hierarchical. For example, a page 
author might push the following message, which has data multiple levels deep:

```js
dataLayer.push({
  one: {
    two: {
      three: 4
    }
  }
});
```

Using the helper, you can retrieve the nested value using dot-notation:

```js
helper.get('one.two.three');     // Returns 4.
helper.get('one.two');           // Returns {three: 4}.
```

## The Abstract Data Model
As mentioned above, the abstract data model is an internal representation, which holds
the most recent value for all keys that have been set by a data layer message. This 
means that as each message is pushed onto the data layer, the abstract data model must 
be updated. The helper library does this using a well-defined process. 

As each message is processed, its key/value pairs will be added to the abstract data 
model. If the key doesn't currently exist in the model, this operation is simple. 
The pair is simply added to the model object. But in the case of key conflicts, we have
to specify how values will be overwritten and/or merged.

There are two possible actions to take when merging a key/value pair onto the abstract 
model; overwriting the existing value or recursively merging the new value onto the 
existing value. The action taken will depend on the type of the two values unless explicitly 
overriden. For this, we define three types of values:

* JavaScript Arrays
* "Plain" Objects
* Everything else

Hopefully, JavaScript Arrays are self-explanatory. "Plain" Objects are JavaScript 
objects that were created via Object literal notation (e.g. `{one: 2}`) or via `new Object`.
`Nulls`, `Dates`, `RegExps`, `Windows`, `DOM Elements`, etc. are not "Plain". Those fall into the 
category of "everything else", along with `strings`, `numbers`, `booleans`, `undefined`, etc.  

Once the type of the new and existing values has been categorized this way, we can use the 
following table to describe what action will happen for that key/value pair:

Existing Value | New Value    | Default Merging Action
---------------|--------------|--------------------------
Array          | Array        | Recursively merge
Array          | Plain Object | Overwrite existing value
Array          | Other        | Overwrite existing value
Plain Object   | Array        | Overwrite existing value
Plain Object   | Plain Object | Recursively merge
Plain Object   | Other        | Overwrite existing value
Other          | Array        | Overwrite existing value
Other          | Plain Object | Overwrite existing value
Other          | Other        | Overwrite existing value

### Overwriting Existing Values
When the merging action is "Overwrite exsting value", the result of the operation is very
simple. The existing value will be completely discarded and the new value will take its 
place in the abstract data model. The following table provides some examples:


Existing Value   | New Value        | Result of Overwrite
-----------------|------------------|---------------------
[1, 2, 3]        | 'hello'          | 'hello'
{ducks: 'quack'} | [1, 2, 3]        | [1, 2, 3]
{ducks: 'quack'} | 'hello'          | 'hello'
'hello'          | [1, 2, 3]        | [1, 2, 3]
'hello'          | {ducks: 'quack'} | {ducks: 'quack'}
'hello'          | 42               | 42

### Recursively Merging Values
When the merging action is "Recursively Merge", the result of the operation will be the 
result of iterating through each property in the new value, and for each property, deciding 
how to copy that sub-key/value into the abstract data model by looking at the type of that 
sub-key in the existing value. If the key does not exist on the existing value, the new 
value is simply assigned to the abstract model. The following examples demonstrate this:

Existing Value     | New Value                     | Result of Overwrite
-------------------|-------------------------------|----------------------------
{one: 1, three: 3} | {two: 2}                      | {one: 1, three: 3, two: 2}
{one: 1, three: 3} | {three: 4}                    | {one: 1, three: 4}
{one: {two: 3}}    | {one: {four: 5}}              | {one: {two: 3, four: 5}}
{one: {two: 3}}    | {two: 4}                      | {one: {two: 3}, two: 4}
[]                 | ['hello']                     | ['hello']
[1]                | [undefined, 2]                | [undefined, 2]
[1]                | [(empty), 2]                  | [1, 2]
[1, {two: 3}]      | [undefined, {two: 4, six: 8}] | [undefined, {two: 4, six: 8}]
[1, {two: 3}]      | [(empty), {two: 4, six: 8}]   | [1, {two: 4, six: 8}]

Notice that an index in a new value array that has been explicitly set to undefined will 
overwrite the corresponding index in the existing array, however an index that has not been
set to any value (i.e. empty values in a sparse array) will not overwrite the corresponding
index in the existing array, even though value at both indexes evaluates to undefined.

### Preventing Default Recursive Merge
Occasionally you may want to avoid persisting values from earlier in the application state. 
This is especially true for single page applications where you may not want outdated information 
in the data model when routing between pages.

To prevent the default recursive merging behavior, a flag can be passed in adjacent 
to the object(s) or array(s) you wish to prevent merging. To do so, add a truthy '_clear' attribute 
to the message with the key/value pair(s) you are targeting. Here are some examples:

Existing Value                         | New Value                                        | Result of Overwrite
---------------------------------------|--------------------------------------------------|--------------------------------------
{a: [1]}                               | {a: [], _clear: true}                            | {a: []}
{a: {x: 1}}                            | {a: {}, _clear: 1}                               | {a: {}}
{a: [undefined, 2]}                    | {a: [1], _clear: true}                           | {a: [1]}
{a: {x: undefined, y: 2}}              | {a: {x: 1}, _clear: true}                        | {a: {x: 1}}
{one: {two: {three: 3}}, five: [1, 2]} | {one: {two: {four: 4}}, five: [3], _clear: true} | {one: {two: {four: 4}}, five: [3]}
{one: {two: {three: 3}}, five: [1, 2]} | {one: {two: {four: 4}, _clear: true}, five: [3]} | {one: {two: {four: 4}}, five: [3, 2]}

### Meta Commands
Using the above methods alone, some operations on the abstract model are somewhat cumbersome.
For example, appending items onto the end of an existing array requires you to know the 
length of the existing array and then requires you to clumsily build an array that can be 
merged onto the existing value.  To make these cases easier, we provide a set of alternative 
syntaxes for updating values that are already in the abstract data model. 

The first of these syntaxes allows you to call any method supported on the existing type. 
For example, if the existing value in the abstract model is an `Array`, you'd have a wide 
variety of APIs that can be called (e.g. `push`, `pop`, `concat`, `shift`, `unshift`, etc.).  To invoke
this syntax, you would push a "command array" onto the data layer instead of a normal message 
object.  

```js
dataLayer.push(['abc.push', 4, 5, 6]);
```

A command array is a normal JavaScript array, where the first element is a string. The string 
contains the key of the value to update, followed by a dot (.), followed by the name of the 
method to invoke on the value.  In the above example, the key to update is `abc`, and the 
method to invoke is the `push` method.  The string may be followed by zero or more arguments, 
which will be passed to the invoked method.  

If the given method name does not exist on the existing value, or if the invocation throws an 
exception, the assignment will be ignored, and a warning message will be logged to the browser's 
developer console (if available).

### Native Methods
Browsers come with dozens, if not hundreds, of useful APIs. Any method supported by the 
existing value can be called using the command array syntax. Here are some additional examples:

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>abc</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>[1, 2, 3]</td>
  </tr>
  <tr>
    <td><b>Command Array:</b></td>
    <td>dataLayer.push(['abc.push', 4, 5, 6])</td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>[1, 2, 3, 4, 5, 6]</td>
  </tr>
</table>

In the following example, no arguments are provided:

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>abc</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>[1, 2, 3]</td>
  </tr>
  <tr>
    <td><b>Command Array:</b></td>
    <td>dataLayer.push(['abc.pop'])</td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>[1, 2]</td>
  </tr>
</table>


In the following example, the value to update (`bbb`) is nested inside a top level object (`aaa`):

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>aaa.bbb</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>[1, 2, 3]</td>
  </tr>
  <tr>
    <td><b>Command Array:</b></td>
    <td>dataLayer.push(['aaa.bbb.push', 4])</td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>[1, 2, 3, 4]</td>
  </tr>
</table>

And the following example demonstrates an operation on a Date object.  Remember that all types 
are supported, not just Arrays:

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>time</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>Fri Dec 20 2013 15:23:22 GMT-0800 (PST)</td>
  </tr>
  <tr>
    <td><b>Command Array:</b></td>
    <td>dataLayer.push(['time.setYear', 2014])</td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>Fri Dec 20 2014 15:23:22 GMT-0800 (PST)</td>
  </tr>
</table>

Notice that because command arrays are processed asynchronously, nothing can be done with the 
return values from these method invocations. This brings us to our second syntax for updating 
values in the abstract data model.

### Custom Methods
So far, we've seen that objects (messages) can be pushed onto the data layer, as well as arrays
(command arrays). Pushing a function onto the data layer will also allow you to update the abstract
data model, but with custom code. This technique has the added benefit of being able to handle
return values of any native method calls made from within the function. When a function
is processed, the value of `this` will be the abstract data model interface, described below.

#### The Abstract Data Model Interface
To safely access the abstract data model from within a custom method, an
API with a getter and setter is provided. `get(key)` will get a key of the model,
and `set(key, value)` will create or overwrite the given key with the new value.

The following examples demonstrate 
how these APIs can be used to update values in the abstract data model.

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>time</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>Fri Dec 20 2013 15:23:22 GMT-0800 (PST)</td>
  </tr>
  <tr>
    <td><b>Custom function:</b></td>
    <td><pre>dataLayer.push(function() {
  this.get('time').setMonth(0); 
})</pre></td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>Fri Jan 20 2013 15:23:22 GMT-0800 (PST)</td>
  </tr>
</table>

The following example demonstrates updating a nested value:

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>aaa.bbb.ccc</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>[1, 2, 3]</td>
  </tr>
  <tr>
    <td><b>Custom function:</b></td>
    <td><pre>dataLayer.push(function() {
  const ccc = this.get('aaa.bbb.ccc');
  ccc.push(ccc.pop() * 2);
})</pre></td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>[1, 2, 6]</td>
  </tr>
</table>


The following example demonstrates overwriting a value:

<table>
  <tr>
    <td><b>Existing Key:</b></td>
    <td>abc</td>
  </tr>
  <tr>
    <td><b>Existing Value:</b></td>
    <td>[1, 2, 3]</td>
  </tr>
  <tr>
    <td><b>Custom function:</b></td>
    <td><pre>dataLayer.push(function() {
  this.set('abc', {xyz: this.get('abc')});
})</pre></td>
  </tr>
  <tr>
    <td><b>Result:</b></td>
    <td>{xyz: [1, 2, 3]}</td>
  </tr>
</table>

## Listening for Messages
When creating a `DataLayerHelper` object, you can also specify a callback function to be called 
whenever a message is pushed onto the given dataLayer. This allows your code to be notified
immediately whenever the dataLayer has been updated, which is a key advantage of the message
queue approach. 

Listener functions are attached to a data layer helper, not the data layer itself.
As such, they should **not** modify the dataLayer (e.g. call dataLayer.push()), as this
may cause other helpers listening to the data layer to see conflicting history.

### With a Listener Function
To add a callback that listens to every push to the data layer, 
Add a function under the `listener` attribute in the second parameter of the `DataLayerHelper` constructor.

```js
function listener(model, message) {
  // Message has been pushed. 
  // The helper has merged it onto the model.
  // Now use the message and the updated model to do something.
}
const helper = new DataLayerHelper(dataLayer, {listener: listener});
```

#### Listening to the Past
Tools that are loaded onto the page asynchronously or lazily will appreciate that you can also
opt to listen to message that were pushed onto the dataLayer in the past. To do so, mark the
`listenToPast` attribute as true in an options object for the second parameter of the `DataLayerHelper`
constructor.

```js
function listener(model, message) {
  // Message has been pushed. 
  // The helper has merged it onto the model.
  // Now use the message and the updated model to do something.
}
const helper = new DataLayerHelper(dataLayer, {
  listener: listener,
  listenToPast: true,
});
```

Using this option means that your listener callback will be called once for every message that
has ever been pushed onto the given data layer. And on each call to the callback, the model
will represent the abstract model at the time of the message.

### By Registering Processors
If you are using a command API to bring messages to the data layer, you may want to run
different processors to respond to different commands pushed to the data layer instead of just
having one global listener for all commands. You can register a function to run whenever commands
with a specific name are pushed to the command API. The function can take any number of arbitrary
arguments, and within the function, the value of this will be [the abstract data model interface](#the-abstract-data-model-interface)
The return value of the function will be merged into the model following the rules
in [recursively merging values](#recursively-merging-values).

First, set up a `commandAPI` function
```js
const dataLayer = [];
const helper = new DataLayerHelper(dataLayer);
function commandAPI() {
  dataLayer.push(arguments);
}
```
Next, use the `registerProcessor` function.
```js
helper.registerProcessor('add', function(number1, number2) {
  // The return value will be merged into the model.
  return {sum: number1 + number2};
});

// Important: to access the model using this,
// registered processors must not be arrow functions.
helper.registerProcessor('copy', function() {
  const sum = this.get('sum');
  // We could also do this.set('ans', sum), but changing
  // the model inside of a registered processor is discouraged.
  return {ans: sum};
});

// If multiple functions are registered with the same key, they
// will be called in the order that they have been registered. Hence,
// this function will be called second. However, it still will not
// update finalAns on the first call, because updates from return values
// won't be merged into the model until all functions have been called.
helper.registerProcessor('copy', function() {
  const ans = this.get('ans');
  return {finalAns: ans};
});
```
The above functions won't be called until we call `commandAPI` with the first parameter equal to the first parameter of `registerProcessor`.
```js
// Abstract data model is {}.
commandAPI('add', 'a', 1, 2);
// Abstract data model is {sum: 3}.
commandAPI('copy');
// Abstract data model is {sum: 3, ans: 3, finalAns: undefined}.
commandAPI('copy');
// Abstract data model is {sum: 3, ans: 3, finalAns: 3}.
```

To register multiple processors when constructing a helper, you can use the second parameter of the
`DataLayerHelper` constructor as an options object. Pass the processors in under the `commandProcessors`
attribute following the data structure presented:

```js
const helper = new DataLayerHelper(dataLayer, {
  commandProcessors: {
    'add': [
      function(a, b) {return {sum: a + b}},
      function(a, b) {return {totalSum: this.get('totalSum') + a + b}},
    ],
    'event': function(eventName) {return {lastEvent: eventName}},
  },
});
```

Similar to the `registerProcessor` method, the `add` command will invoke the two functions passed in to
the `add` attribute in order.

#### Delaying Processing

Tools that are loaded onto the page asynchronously or lazily will appreciate that you can also
opt to delay the processing the dataLayer until all command API processors are registered. Since
command API processors do not reprocess past dataLayer messages, it is important to register them
before processing the commands intended to invoke them.

To delay processing, mark the `processNow` attribute as false in an options object for the second parameter
of the `DataLayerHelper` constructor. When the helper is ready to begin processing the dataLayer, simply call
the `process` method of `DataLayerHelper`. Note that the helper will not respond to any messages pushed onto
the dataLayer until `process` has been called.

```js
const helper = new DataLayerHelper(dataLayer, {
  processNow: false,
});

// Command processors are registered lazily as asynchronous actions occur.
// The abstract data model is empty as the helper has not yet processed the dataLayer.
// Once all async actions are completed, we are ready for our helper to process the dataLayer.

helper.process();

// All messages that have been pushed onto the dataLayer are processed and added to the data model.
// If any commands were pushed, they invoke the registered command processors.
```

## Summary
We've seen above that the data layer provides a simple API for page authors. They simply define
an array called `dataLayer`, then push messages onto it. 

There are three types of messages:
* Standard Messages (Objects)
* Native Method Calls (Command Arrays)
* Custom Method Calls (Functions)

This helper library provides tools and vendors a way to consume these messages. It automatically
listens for new messages and merges them onto its abstract data model. You can query the model
using the `get()` API, or you can get message notifications with a callback function.

At this point, we highly recommend that you read the code and browse the tests for examples of
how the library works and how it can be used.

## Build and Test

A few prerequisites:

1. [Install Node.js](http://nodejs.org/download/)
2. [Install yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
3. [Install git](https://help.github.com/articles/set-up-git)

Clone a copy of the project repo by running:

```bash
git clone --recursive git://github.com/google/data-layer-helper.git
```

Enter the data-layer-helper directory and install the Node dependencies, this time *without* specifying a global install:

```bash
cd data-layer-helper
yarn install
```

That should be everything.  You can try running the build, which will run the linter, compile/minify the JavaScript and run the tests in chrome.

```bash
yarn start
```

The built version (data-layer-helper.js) will be in the `dist/` subdirectory. However, this build will do it's best to fail silently
when strange inputs are passed into it. For development, you may want to use a build that will give more detailed logging. Run the following command:

```bash
yarn build-debug
```

to make the debug build available (dist/data-layer-helper-debug.js).

To run the tests for more than a single run (i.e. for development), you can the run the command

```bash
yarn unit
```
or
```bash
yarn integration
```

depending on if you would like to run the unit or integration tests.

## License

   Copyright 2012 Google Inc. All Rights Reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

