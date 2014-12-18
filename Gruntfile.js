'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		qunit: {
			files: ['test/**/*.html']
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('test', ['qunit']);
};
