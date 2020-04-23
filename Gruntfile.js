module.exports = function (grunt) {

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/app/css/Main.css': 'app/src/css/Main.scss',
                    'dist/app/css/LayerConfig.css': 'app/src/js/widgets/css/LayerConfig.scss'
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/app/css/Main.min.css': 'dist/app/css/Main.css',
                    'dist/app/css/LayerConfig.min.css': 'dist/app/css/LayerConfig.css'
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/app/js/Main.min.js': 'dist/app/js/Main.js',
                    'dist/app/js/dojo.min.js': 'dist/app/js/dojo.js'
                }
            }
        },
        watch: {
            scripts: {
                files: ['dist/app/js/Main.js', 'dist/app/js/dojo.js'],
                tasks: ['uglify']
            },
            sass: {
                files: ['app/src/css/Main.scss', 'app/src/js/widgets/css/LayerConfig.scss'],
                tasks: ['sass']
            },
            styles: {
                files: ['dist/app/css/Main.css', 'dist/app/css/LayerConfig.css'],
                tasks: ['cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['sass', 'cssmin', 'uglify', 'watch']);

}