/*global IGV*/

(function () {
  'use strict';

  if (/ft.com$/.test(document.domain))
    document.domain = 'ft.com';

  if (document.location.search === '?debug')
    IGV.debug = true;

  var defaults = {
    baseURL: '//interactivegraphics.ft-static.com/sites/2013/seasonal-appeal/videos/'
  };

  IGV.run(defaults, function () {
    console.log('Videos ready');
  });

}());
