var destination = './build';
var src = './src';

module.exports = {
    browserify: {
        debug: true,
        bundleConfigs: {
            src: src + '/js/main.js',
            dest: src + '/js/',
            sourceDestinationFile: 'main.js'
        }
    },
    jshint : {
        config: {
            src: src + '/js/*.js'
        }
    }
};