var context = require.context('./test', true, /-specs\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);