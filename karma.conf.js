var testMinified = process.argv.indexOf('--min') > -1,
    subject;

if (testMinified) {
  subject = 'build/angular-retina.min.js';
  console.log('Testing minifed angular-retina');
} else {
  subject = 'lib/angular-retina.js';
}

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      subject,
      'test/unit/**/*.js'
    ],
    port: 9877,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false,
    reporters: ['dots', 'coverage'],
    preprocessors: {
      'lib/angular-retina.js': ['coverage']
    },
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-jasmine'
    ],
    coverageReporter: {
      reporters: [{
        type: 'html',
        subdir: 'report-html'
      }, {
        type: 'lcov',
        subdir: 'report-lcov'
      },
      {
        type: 'text-summary',
        subdir: '.',
        file: 'text-summary.txt'
      }]
    }

  });
};
