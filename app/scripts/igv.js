/*global scrolling, captionator*/

(function (window, document, $) {
  'use strict';

  var IGV;
  var $window = $(window);

  var MIME_TYPES = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg'
  };

  // Default video settings
  var defaults = {
    baseURL: '',
    sourceTypes: ['mp4', 'webm', 'ogg']
  };

  // Misc helpers
  function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }

  function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  // Video class
  var Video = (function () {

    function Video(options) {
      // Establish settings
      $.extend(options, defaults);
      this.options = options;
      this.name = options.name;
      this.playing = false;
      this.$cont = $(options.containerEl);
      this.playButton = this.$cont.is('[data-igv-playbutton]');

      // Prepare container div
      this.$cont.empty().addClass('igv igv--paused');
      if (IGV.debug)
        this.$cont.addClass('igv--debug');

      // Set the element whose scroll position to track
      if (this.options.looper && !this.options.scrollElement)
        this.options.scrollElement = options.containerEl;

      // Assign the autoPlayPause method (not on prototype)
      var v = this;
      this.autoPlayPause = function () {
        // console.log('autoPlayPause', v);

        if (v.videoEnabled && v.options.looper) {
          if (v.isInViewport())
            v.play();
          else
            v.pause();
        }
      };

      // Set up video if necessary
      if (!this.options.looper || IGV.enableLoopingVideos) {
        this.videoEnabled = true;

        // Create the <video> and <source> elements
        this.$video = $('<video>')
          .on({
            playing: function () {
              v.$cont
                .addClass('igv--playing')
                .removeClass('igv--paused');
              v.playing = true;
            },
            pause: function () {
              v.playing = false;
              v.$cont
                .removeClass('igv--playing')
                .addClass('igv--paused');
            }
          })
        ;

        var src = options.baseURL + options.name + '.',
            types = options.sourceTypes;
        for (var i = 0; i < types.length; i++) {
          var type = types[i];
          $('<source>')
            .attr({
              type: MIME_TYPES[type],
              src: src + type
            })
            .appendTo(this.$video);
        }

        // Loop if necessary
        if (options.looper) {
          this.$video.prop({
            loop: true,
            volume: 0, // just in case
            preload: 'auto'
          });
        }
        else {
          // Not looping; add a play button
          if (this.playButton) {
            this.$cont.append('<div class="igv__play-button"><div class="igv__play-button__circle"></div><div class="igv__play-button__icon"><div class="igv__play-button__triangle"></div></div><div class="igv__play-button__text"></div></div>');
          }

          // Toggle play/pause on click
          this.$cont.click(function () {
            v.toggle();
          });
        }

        // Attach to DOM
        this.$cont.addClass('igv--video-enabled').append(this.$video);

        // Set up subtitles
        // if (this.$cont.is('[data-igv-subtitles]')) {
        //   this.$video.append('<track kind="subtitles" src="' /*+ this.options.baseURL*/ + this.name + '.vtt" srclang="en" label="English Subtitles" default>');
        //   // console.log('YYY', this.$cont.children('track')[0]);

        //   captionator.captionify(this.$video[0]);
        //   // console.log(this.$video[0]);
        //   // this.$video[0].tracks[0].mode = captionator.TextTrack.SHOWING;
        // }
      }
    }

    var windowHeight = $window.height();
    $window.on('resize', throttle(function () {
      windowHeight = $window.height();
    }, 300));
    Video.prototype.isInViewport = function () {
      var rect = this.rect = this.options.scrollElement.getBoundingClientRect();

      return (
        rect.top <= (windowHeight - IGV.visibilityThreshold) &&
        rect.bottom > IGV.visibilityThreshold
      );
    };

    Video.prototype.play = function () {
      if (this.videoEnabled && !this.playing) {
        this.$video[0].play();
      }
    };

    Video.prototype.pause = function () {
      if (this.videoEnabled && this.playing) {
        this.$video[0].pause();
      }
    };

    Video.prototype.toggle = function () {
      if (this.playing)
        this.pause();
      else
        this.play();
    };

    return Video;
  })();


  // IGV - video management singleton
  (function () {
    function updateDebugInfo() {
      var debugHTML = 'Looping videos<ol>', video;
      for (var i = 0, l = IGV.videos.length; i < l; i++) {
        video = IGV.videos[i];
        if (video.options.looper && video.rect)
          debugHTML += (
            '<li>' + (video.playing ? '▸' : '■') + '&nbsp;&nbsp;&nbsp;' +
            video.rect.top + '...' + video.rect.bottom +
            ' – ' + video.name + '</li>'
          );
      }
      debugHTML += '</ol>';
      IGV.$debugInfo.html(debugHTML);
    }

    function autoPlayPauseAll() {
      $.each(IGV.videos, function () {
        this.autoPlayPause();
      });
    }

    window.IGV = IGV = {
      videos: [],
      debug: false,
      enableLoopingVideos: true,
      visibilityThreshold: 100,

      run: function (globalSettings, callback) {
        // Set up debug info box if necessary
        if (IGV.debug)
          IGV.$debugInfo = $('<div id="igv-debug-info"></div>').appendTo('body');

        // Normalise args and merge options with defaults
        if (arguments.length === 1 && isFunction(globalSettings)) {
          callback = globalSettings;
        }
        if (globalSettings && !isFunction(globalSettings))
          $.extend(defaults, globalSettings);

        // Find all data-igv elements, and enhance them
        $(function () {
          $('[data-igv]').each(function() {
            var $cont = $(this);

            // Ascertain which element should be scrolled
            var scrollElement;
            if ($cont.is('[data-igv-scrollelement]')) {
              var scrollerSelector = $cont.attr('data-igv-scrollelement');
              scrollElement = $cont.closest(scrollerSelector)[0];
            }

            // Make the video
            IGV.create({
              containerEl: this,
              looper: $cont.is('[data-igv-loop]'),
              name: $cont.attr('data-igv'),
              scrollElement: scrollElement // if not set, it will use the igv container itself
            });
          });

          // Auto-play/pause now and on scroll event
          if ($('[data-igv-loop]').length) {
            autoPlayPauseAll();
            if (IGV.debug) updateDebugInfo();
            $window.on('scroll resize', throttle(function() {
              autoPlayPauseAll();
              if (IGV.debug)
                updateDebugInfo();
            }, 50));
          }

          if (isFunction(callback))
            callback();
        });
      },

      create: function (options) {
        IGV.videos.push(new Video(options));
      }
    };

  })();

}(this, document, jQuery));
