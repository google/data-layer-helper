# Data Layer Helper Library
This library provides the ability to process messages passed onto a dataLayer queue.

- [Background](#what-is-a-datalayer-queue)
- [Why Do We Need a Library?](#why-do-we-need-a-library)
- [The Abstract Data Model](#the-abstract-data-model)
    - [Overwriting Existing Values](#overwriting-existing-values)
    - [Recursively Merging Values](#recursively-merging-values)
    - [Meta Commands](#meta-commands)
    - [Native Methods](#native-methods)
    - [Custom Methods](#custom-methods)
- [Listening for Messages](#listening-for-messages)
    - [Processing the Past](#processing-the-past)
- [Summary](#summary)
- [Build and Test](#build-and-test)
- [License](#license)
  

## What is a dataLayer queue?
A dataLayer queue is simply a JavaScript array that lives on a webpage. 

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

## Why do we need a library?
The dataLayer system make things very easy for page authors. The syntax is simple, and there's no
extra code to load. But this system _does_ make life a little more difficult for vendors and tools
that want to consume the data. That's where this library comes in. 

This project provides the ability to listen for dataLayer messages and to read the key/value pairs 
that have been set by all the previous messages. It can be used by the tools/vendors mentioned above, 
or by page authors that need to read back the data they've emitted.

To use this library, you'll need to get it onto the page. You can do this by hosting a copy and 
sourcing it from the page, or by compiling it into your own JavaScript library. Once it's on the 
page, you can create a new helper object like this:

```js
var helper = new DataLayerHelper(dataLayer);
```

This helper object will listen for new messages on the given dataLayer.  Each new message will be 
merged into the helper's **"abstract data model"**.  This internal model object holds the most recent
value for all keys which have been set on messages processed by the helper. 

You can retrieve values from the data model by using the helper's get() method:

```js
helper.get('category');   // Returns "Science".
```

As mentioned above, messages passed onto the dataLayer can be hierarchical. For example, a page 
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
As mentioned above, the abstract data model is an internal representation, which hold
the most recent value for all keys that have been set by a dataLayer message. This 
means that as each message is pushed onto the dataLayer, the abstract data model must 
be updated. The helper library does this using a well-defined process. 

As each message is processed, its key/value pairs will be added to the abstract data 
model. If the key doesn't currently exist in the model, this operation is simple. 
The pair is simply added to the model object. But in the case of key conflicts, we have
to specify how values will be overwritten and/or merged.

There are two possible actions to take when merging a key/value pair onto the abstract 
model; overwriting the existing value or recursively merging the new value onto the 
existing value. The action taken will depend on the type of the two values. For this, 
we define three types of values:

* JavaScript Arrays
* "Plain" Objects
* Everything else

Hopefully, JavaScript Arrays are self-explanatory. "Plain" Objects are JavaScript 
objects that were created via Object literal notation (e.g. {one: 2}) or via "new Object".
Nulls, Dates, RegExps, Windows, DOM Elements, etc. are not "Plain". Those fall into the 
category of "everything else", along with strings, numbers, booleans, undefined, etc.  

Once the type of the new and existing values has been categorized this way, we can use the 
following table to describe what action will happen for that key/value pair:

Existing Value | New Value    | Merging Action
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
[1]                | [undefined, 2]                | [1, 2]
[1, {two: 3}]      | [undefined, {two: 4, six: 8}] | [1, {two: 4, six: 8}] 

### Meta Commands
Using the above methods alone, some operations on the abstract model are somewhat cumbersome.
For example, appending items onto the end of an existing array requires you to know the 
length of the existing array and then requires you to clumsily build an array that can be 
merged onto the existing value.  To make these cases easier, we provide a set of alternative 
syntaxes for updating values that are already in the abstract data model. 

The first of these syntaxes allows you to call any method supported on the existing type. 
For example, if the existing value in the abstract model is an Array, you'd have a wide 
variety of APIs that can be called (e.g. push, pop, concat, shift, unshift, etc.).  To invoke
this syntax, you would push a "command array" onto the dataLayer instead of a normal message 
object.  

```js
dataLayer.push(['abc.push', 4, 5, 6]);
```

A command array is a normal JavaScript array, where the first element is a string. The string 
contains the key of the value to update, followed by a dot (.), followed by the name of the 
method to invoke on the value.  In the above example, the key to update is 'abc', and the 
method to invoke is the 'push' method.  The string may be followed by zero or more arguments, 
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


In the following example, the value to update (bbb) is nested inside a top level object (aaa):

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
So far, we've seen that objects (messages) can be pushed onto the dataLayer, as well as arrays 
(command arrays). Pushing a function onto the dataLayer will also allow you to update the abstract 
data model, but with custom code. This technique has the added benefit of being able to handle 
return values of any native method calls made from within the function.

When a function is processed, it will be executed in the context of the abstract data model. The 
value of "this" will be an interface that represents the current abstract data model. This 
interfact will provide two APIs: get(key) and set(key, value). The following examples demonstrate 
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
  var ccc = this.get('aaa.bbb.ccc');
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
When creating a DataLayerHelper object, you can also specify a callback function to be called 
whenever a message is pushed onto the given dataLayer. This allows your code to be notified
immediately whenever the dataLayer has been updated, which is a key advantage of the message
queue approach.

```js
function listener(message, model) {
  // Message has been pushed. 
  // The helper has merged it onto the model.
  // Now use the message and the updated model to do something.
}
var helper = new DataLayerHelper(dataLayer, listener);
```

### Processing the Past
Tools that are loaded onto the page asynchronously or lazily will appreciate that you can also
opt to process message that were pushed onto the dataLayer in the past. This can be done by 
passing true as the third parameter in the DataLayerHelper constructor.

```js
function listener(message, model) {
  // Message has been pushed. 
  // The helper has merged it onto the model.
  // Now use the message and the updated model to do something.
}
var helper = new DataLayerHelper(dataLayer, listener, true);
```

Using this option means that your listener callback will be called once for every message that
has ever been pushed onto the given dataLayer. And on each call to the callback, the model
will represent the abstract model at the time of the message.

## Summary
We've seen above that the dataLayer provides a simple API for page authors. They simply define
an array called dataLayer, then push messages onto it. 

There are three types of messages:
* Standard Messages (Objects)
* Native Method Calls (Command Arrays)
* Custom Method Calls (Functions)

This helper library provides tools and vendors a way to consume these messages. It automatically
listens for new messages and merges them onto its abstract data model. You can query the model
using the get() API, or you can get message notifications with a callback function.

At this point, we highly recommend that you read the code and browse the tests for examples of
how the library works and how it can be used.

## Build and Test

A few prerequisites:

1. [Install Node.js and npm](http://nodejs.org/download/)
2. [Install Git](https://help.github.com/articles/set-up-git)

Clone a copy of the project repo by running:

```bash
git clone --recursive git://github.com/google/data-layer-helper.git
```

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) package if you haven't before. This should be done as global install:

```bash
npm install -g grunt-cli
```

Enter the data-layer-helper directory and install the Node dependencies, this time *without* specifying a global install:

```bash
cd data-layer-helper
npm install
```

Enter the third_party/closure-linter directory and install the Closure linter:

```bash
cd third_party/closure-linter
python setup.py install
```

Make sure you have `grunt` installed. From the root directory of the project, run:

```bash
grunt -version
```

That should be everything.  You can try running the build, which will run the linter, compile/minify the JavaScript and run the tests.

```bash
grunt
```

The built version (data-layer-helper.js) will be in the `dist/` subdirectory.


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

