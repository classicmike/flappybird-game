var dest = './build';
var src = './src';

module.exports = {
    browserify: {
        debug: true,
        bundleConfigs: {
            src: src + '/js/main.js',
            dest: dest + '/js/',
            sourceDestinationFile: 'main.js'
        }
    },
    jshint : {
        config: {
            src: src + '/js/*.js'
        }
    },
    html: {
        config: {
            src: src + '/index.html',
            dest: dest
        }
    },
    styles: {
        config: {
            src: src + '/css/*.css',
            dest: dest + '/css/',
            sourceDestinationFile: 'main.css'
        }
    }
};