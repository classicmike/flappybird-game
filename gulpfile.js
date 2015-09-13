var requireDir = require('require-dir');
//require all the tasks in the gulp directory
var tasks = requireDir('./gulp/tasks', { recurse: true });

//get out the config that are located in each file.
var config = require('./gulp/config');

// lists out all of the tasks that are required for the project
tasks.browserify(config.browserify);
tasks.jshint(config.jshint.config);
tasks.images(config.images.config);
tasks.html_default(config.html.config);
tasks.styles(config.styles.config);
tasks.watch(config.watch);
