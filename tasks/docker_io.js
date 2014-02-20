/*
 * grunt-docker.io
 * https://github.com/skibum55/grunt-docker.io
 *
 * Copyright (c) 2014 Sean Keery
 * Licensed under the MIT license.
 *
 * Deploy updated node application into docker container.
 *
 * Parameters:
 *  Host - server running docker daemon.  Default = 127.0.0.1
 *  Port - port docker daemon is using.  Default = 4243
 *  Key - public key for connections that are secure. Default is null 
 *  Version - Id of current container version.  Default = '0.0.1' 
 *  Image - name of container. Default = '<repository name>'
 *  JSONParameters - parameters used to start containers (post json file?)
 *
 * Tasks :
 *  Pull version number from metadata
 *  Attach to host (optional SSL)
 *  Build container from image
 *  Stop existing container (if it exists)
 *  Start new container
 *  Increment version number in source
 *  
 * Requirements :
 *  Docker >= 0.8
 *  Grunt ~=0.4.2
 *  REST
 *
 * Dependencies :
 *  See package.json
 *
 *
 * Future:
 *  Error handling
 *  Rollback to previous version(s)
 *  Build new containers or images from local Dockerfile
 *  Build on multiple hosts
 *  Register hosts with load balancer, scaling groups and service registries
 *  Orchestrations with Maestro-NG
 */

'use strict';

var Docker = require('dockerode');
var docker = new Docker({host: 'http://192.168.1.10', port: 3000});

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('docker_io', 'Grunt plugin to build docker containers', function () {

    // build docker image from local tarball
    docker.buildImage('archive.tar', {t: imageName}, function(err, response){
    //...
    });
    // run container
    docker.run('ubuntu', ['bash', '-c', 'uname -a'], process.stdout, function(err, data, container) {
      console.log(data.StatusCode);
    });
    
    // individual container stuff
    var container = docker.getContainer('71501a8ab0f8');

    container.start(function (err, data) {
      console.log(data);
    });

    container.remove(function (err, data) {
      console.log(data);
    });
    
    // stop all Containers
    docker.listContainers(function(err, containers) {
      containers.forEach(function(containerInfo) {
        docker.getContainer(containerInfo.Id).stop(cb);
      });
    });
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
