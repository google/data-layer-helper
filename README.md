# UNDER CONSTRUCTION!

This project is still in the process of being pieced together. It's probably broken. Do not use this.


# Data Layer Helper Library

This library provides the ability to process messages passed onto a dataLayer queue.

A dataLayer queue is simply a JavaScript array that lives on a webpage. Page authors can append
messages onto the queue in order to emit information about the page and its state. These messages
are simply JavaScript objects containing a hierarchy of key/value pairs. They can be metadata
about the page content, information about the visitor, or data about events happening on the page.
This system allows tools like analytics libraries and tag management systems to access this data
in a standard way, so page authors can avoid using a bunch of proprietary, repetitive APIs.

This library provides the ability to listen for dataLayer messages and to read the key/value pairs
that have been set by all the previous messages. It can be used by the tools/vendors mentioned
above, or by page authors that need to read back the data they've emitted.

TODO(bkuhn): Add example of using the dataLayer and the helper once the API is a bit more stable.

For more background on what a "dataLayer" is, please see:

1. [Justin Cutroni's Original Blog Post](http://cutroni.com/blog/2012/05/14/make-analytics-better-with-tag-management-and-a-data-layer/)
2. [Google Tag Manager Docs](https://developers.google.com/tag-manager/devguide#datalayer)


## Getting Started

A few prerequisites:

1. [Install Node.js and npm](http://nodejs.org/download/)
2. [Install Git](https://help.github.com/articles/set-up-git)

Clone a copy of the project repo by running:

```bash
git clone git://github.com/google/data-layer-helper.git
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

Make sure you have `grunt` installed by testing:

```bash
grunt -version
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version, type the following:

```bash
grunt
```

The built version will be in the `dist/` subdirectory, along with a minified copy.


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

