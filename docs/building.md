# Building


## Setup

    # Clone the project
    git clone git@github.com:someone/dataLayer_helper.git
    cd dataLayer_helper/
    # Run one-time setup of dependencies
    sudo scripts/setup.sh

    # Source the utility script to get the nice bash aliases
    # You'll want to do this every time you start up a new prompt
    source dlhrc
    # Start a dev server on port 8080
    anvil serve -p 8080 &
    # Do a full build
    anvil build :debug :release

    # When updating goog.require/provide or soy/gss you must regen:
    anvil build :fast

## Edit-reload

Running the examples in uncompiled mode by appending `?uncompiled` to the URL
will enable a nice edit-reload cycle. In most cases you can make changes and
reload with no other actions needed. If you change a `goog.require` or
`goog.provide` or modify a .soy or .gss file you'll need to do an
`anvil build :fast` to update everything.

