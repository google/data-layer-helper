# Data Layer Helper Library

This library provides the ability to process messages passed onto a dataLayer queue.

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

## So why do we need a library?

The dataLayer system make things very easy for page authors. The syntax is simple, and there are no
libraries to load. But this system does make life a little more difficult for vendors and tools
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
merged into the helper's "abstract data model".  This internal model object holds the most recent
value for all keys which have been set on messages processed by the helper. 

You can retrieve values from the data model by using the helper's get() method:

```js
helper.get('category');   // Returns "Science".
```

TODO(bkuhn): More documentation coming here...




For more background on what a "dataLayer" is, please see:

1. [Justin Cutroni's Original Blog Post](http://cutroni.com/blog/2012/05/14/make-analytics-better-with-tag-management-and-a-data-layer/)
2. [Google Tag Manager Docs](https://developers.google.com/tag-manager/devguide#datalayer)


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

