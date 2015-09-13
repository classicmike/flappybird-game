var requireDir = require('require-dir');
//require all the tasks in the gulp directory
var tasks = requireDir('./gulp/tasks', { recurse: true });

var config = require('./gulp/config');

tasks.browserify(config.browserify);

