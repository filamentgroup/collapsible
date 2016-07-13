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
		copy: {
			libs: {
				files: [
          { expand: true, cwd: 'node_modules/jquery/dist', src: [ "jquery.js" ], dest: "src/lib"},
          { expand: true, cwd: 'node_modules/xrayhtml/dist/', src: [ "xrayhtml.*" ], dest: "src/lib"}
				]
			}
    },
		qunit: {
			files: ['test/**/*.html']
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('test', ['qunit']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('default', ['copy', 'test', 'lint']);
	grunt.registerTask('travis', ['test']);
	grunt.registerTask('stage', ['default']);
};
