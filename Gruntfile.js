'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		ngmin: {
			dist: {
				src: ['lib/<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= ngmin.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'lib/*.js'],
			options: {
				curly: false,
				browser: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				expr: true,
				node: true,
				globals: {
					exports: true,
					angular: false,
					$: false
				}
			}
		},
		karma: {
			test: {
				options: {
					browsers: ['ChromeCanary'],
					singleRun: true
				}
			},
			testall: {
				options: {
					browsers: ['Safari', 'Chrome', 'ChromeCanary', 'Firefox', 'Opera'],
					singleRun: true
				}
			},
			'travis-ci': {
				options: {
					browsers: ['Firefox'],
					singleRun: true
				}
			},
			options: {
				reporters: ['dots'],
				configFile: 'test/karma.conf.js'
			}
		}
	});

	// Load devDependencies from package.json
	require('load-grunt-tasks')(grunt);

	// Default task.
	grunt.registerTask('default', ['test']);

	// Test tasks.
	grunt.registerTask('test', ['jshint', 'karma:test']);
	grunt.registerTask('testall', ['karma:testall']);
	grunt.registerTask('travis-ci', ['jshint', 'karma:travis-ci']);

	// Build task.
	grunt.registerTask('build', ['test', 'ngmin', 'concat', 'uglify']);
};
