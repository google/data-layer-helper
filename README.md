# UNDER CONSTRUCTION!

This project is still in the process of being pieced together. Nothing works yet. Do not use this.

# dataLayer_helper

This library provides the ability to process messages passed onto a dataLayer queue.

For more background on what a "dataLayer" is, please see:

(http://cutroni.com/blog/2012/05/14/make-analytics-better-with-tag-management-and-a-data-layer/)

(https://developers.google.com/tag-manager/devguide#datalayer)


TODO(bkuhn): More docs.


## Getting Started

    git clone git@github.com:someone/dataLayer_helper.git
    cd dataLayer_helper/
    source dlhrc
    anvil serve -p 8080 &
    anvil build :fast :debug :release
    open http://localhost:8080/examples/something.html?uncompiled

    # Edit-reload works, but run this if you change a goog.provide/require:
    anvil build :fast

    # Build and copy the 'dlh_js_compiled.js' file someplace:
    anvil deploy -o /tmp/foo/ :release

## License

   Copyright 2013 Google Inc. All Rights Reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

