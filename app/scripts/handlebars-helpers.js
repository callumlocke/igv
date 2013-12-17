/*global Handlebars:true  */

'use strict';

Handlebars.createGlobalHelper = function(name, hash, commands) {
  commands = commands || {};
  Handlebars.registerHelper(name, function(context) {
    if (!context) {
      return '';
    }

    var c = context.toString();
    var val = hash[c];
    var fn = typeof commands[c] === 'function' ? commands[c] : null;

    if (fn) {
      context = val;
      val = fn.apply(this, arguments);
    }

    return val;
  });
};

Handlebars.createOptionsHelper = function(options, commands) {
  var isAbsURL = /^https?:\/\//;
  var o = {
    'image.baseURL': function(baseURL, filename) {
      baseURL = baseURL || 'images/content';
      return isAbsURL.test(filename) ? filename : (baseURL + '/' + filename).replace(/[^:]\/{2,}/, '/');
    }
  };
  Handlebars.Utils.extend(o, commands);
  Handlebars.createGlobalHelper('options', options, o);
};


Handlebars.registerHelper('href', function (text) {
  if (!text) {
    return '';
  }

  var uuid = /^uuid\:\/{2}/;

  if (uuid.test(text)) {
    return 'http://www.ft.com/cms/0/' + text.split(uuid)[1] + '.html';
  }

  return text;
});


