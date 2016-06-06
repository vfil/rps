# RPS - rock-paper-scissors game.
In browser rock-paper-scissors game.

Is well suited for random seeking relaxation players, as well for strategic players that love puzzles.
Believe or not, but there is some logic around!
   
## Browser & device support
Mobile friendly, runs on IE 9 and up, recent versions of Chrome, Firefox, Safari, Edge.

## Build
To build application run in root directory:

```
npm run build -- {env} {buildPath}
```

Ex: `npm run build -- development ./myBuildDir`
If you omit parameters this will result in a build with "production" env into "./build" directory.
"env" is either "production" or "development".

When building in development mode app will be wrapped in browser-sync server.

## Documentation
JsDocs documentation is generated under "docs" directory by executing:

```
npm run generate-docs
```

## Unit tests
To run test in watch mode run:

```
npm test
```

To execute test suites with coverage report run:

```
npm run coverage
```
Running tests will involve also code style checks and potential problems detection with eslint.
