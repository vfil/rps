const AppBuilder = require('./AppBuilder');

//skip node cmd and executed file name;
const args = process.argv.slice(2);

//build application with provided args.
AppBuilder(args);
