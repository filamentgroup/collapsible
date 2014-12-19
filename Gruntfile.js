module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		qunit: {
			files: ['test/**/*.html']
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('test', ['qunit']);
	grunt.registerTask('default', ['test']);
};
