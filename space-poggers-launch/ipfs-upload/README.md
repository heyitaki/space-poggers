# Photoshop scripting
## About
For the Space Poggers token launch, we need to mint ~15k unique tokens. This project addresses the first step of this process: creating the 15k distinct artworks. This is done using a Photoshop file with every character, background, and accessory in a different layer. We can compute random permutations and pick the corresponding layers in PS to form the final composite image.

## Technical stuff
Writing code to interact with Adobe products isn't fun. The Adobe ecosystem uses a JS-based extension called ExtendScript. Unfortunately, Extendscript is stuck in the dark ages and only has support for ES3, meaning we have to polyfill such methods as Object.keys and ES6 importing doesn't work as intended (even if we use webpack/babel, but maybe I'm just bad and didn't configure that correctly).