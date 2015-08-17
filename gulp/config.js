var destination = './build';
var src = './src';

module.exports = {
    browserify: {
        debug: true,
        bundleConfigs: {
            src: ['./src/js/*.js'],
            dest: destination + '/js/',
            sourceDestinationFile: 'main.js'
        }
    },
    jshint : {
        config: {
            src: src + '/js/*.js'
        }
    }
};