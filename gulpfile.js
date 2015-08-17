var requireDir = require('require-dir');
//require all the tasks in the gulp directory
requireDir('./gulp/tasks', { recurse: true });

