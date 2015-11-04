module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: {
				options: {
					jshintrc: ".jshintrc"
				},
				src: ['Gruntfile.js', 'src/*.js']
			}
		},
		browserify: {
			dist: {
				files: {
					'dist/collapsible.js': ['src/*.js']
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('test', ['qunit']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('default', ['test', 'lint', 'browserify']);
};
