'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var includes = require('lodash.includes');
var plBase = ('./source/_patterns');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Hi! This will help you build a ' + chalk.red('component folder') + ' with assets.'
    ));

    var prompts = [{
      type: 'list',
      name: 'patternType',
      message: 'Where would you like this new component?',
      choices: fs.readdirSync(plBase, 'utf8')
    }, {
      type: 'list',
      name: 'patternSubType',
      message: 'Where in here?',
      choices: function(answers) {
        var folder = path.join(plBase, answers.patternType);
        var subfolders = fs.readdirSync(folder, 'utf8');
        return ['./'].concat(subfolders);
      }
    }, {
      name: 'name',
      message: 'What shall we name it?',
      filter: function(answer) {
        return answer.replace(/ /g, '-').toLowerCase();
      }
    }, {
      type: 'checkbox',
      name: 'files',
      message: 'What files would you like in there?',
      choices: [
        'mustache',
        'scss',
        'json',
        'md',
        'js'
      ],
      default: [
        'mustache',
        'scss',
        'json',
        'md'
      ]
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      props.dashlessName = props.name.replace(/-/g, '');
      this.props = props;
    }.bind(this));
  },

  writing: function () {

    var destPath = path.join(plBase, this.props.patternType, this.props.patternSubType, this.props.name);
    console.log(destPath);

    if (includes(this.props.files, 'scss')) {
      this.fs.copyTpl(
        this.templatePath('_pattern.scss'),
        this.destinationPath(path.join(destPath, '_' + this.props.name + '.scss')),
        this.props
      );
    }

    if (includes(this.props.files, 'mustache')) {
      this.fs.copyTpl(
        this.templatePath('pattern.mustache'),
        this.destinationPath(path.join(destPath, this.props.name + '.mustache')),
        this.props
      );
    }

    if (includes(this.props.files, 'json')) {
      this.fs.copyTpl(
        this.templatePath('pattern.json'),
        this.destinationPath(path.join(destPath, this.props.name + '.json')),
        this.props
      );
    }

    if (includes(this.props.files, 'js')) {
      this.fs.copyTpl(
        this.templatePath('pattern.js'),
        this.destinationPath(path.join(destPath, this.props.name + '.js')),
        this.props
      );
    }

    if (includes(this.props.files, 'md')) {
      this.fs.copyTpl(
        this.templatePath('pattern.md'),
        this.destinationPath(path.join(destPath, this.props.name + '.md')),
        this.props
      );
    }

  },

  // install: function () {
  //   this.installDependencies();
  // }
});
