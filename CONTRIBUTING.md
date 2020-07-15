# Contributing

Have a fix or feature? Submit a pull request - we love them!

## Paperwork

As this is a Google project, you *must* first e-sign the [Google Contributor License Agreement](http://code.google.com/legal/individual-cla-v1.0.html) before we can accept any code. It takes only a second and basically just says you won't sue us or claim copyright of your submitted code. You only need to do this once for any Google project.

## Style

Before submitting a pull request, please try to ensure that your code conforms to the [google style guide](https://google.github.io/styleguide/jsguide.html).
Above the style guide, we would like to keep this library small. Do  not write code that requires unneccesary polyfills.
In particular, do not use for-of loops, rest parameters, spread operators, Map, Set, WeakMap, WeakSet, Symbols, or Generators.

## Testing

Before submitting a pull request, please make sure that 
```bash
yarn test
```
does not fail any unit tests or give any lint warnings.
