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
            src: dest + '/js/*.js'
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
    },
    images: {
        config: {
            src: src + '/img/**/*',
            dest: dest + '/img/'
        }
    },
    watch: [
        {
            watchLocation: src + '/js/*.js',
            task: 'jshint'
        },
        {
            watchLocation: src + '/index.html',
            task: 'images'
        },
        {
            watchLocation: src + '/css/*.css',
            task: 'styles'
        }
    ]
};