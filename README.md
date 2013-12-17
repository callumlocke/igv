IGV
===

Usage
-----

You could just install this repo as a bower component and include the files from it.

1. Include `igv.js` and `igv.scss` in your project. (Requires jQuery.)
2. Set `data-igv-*` attributes on one or more DIVs (see below).
3. Call `IGV.run()` whenever you're ready for it to enhance the elements.


Data attributes
---------------

- `data-igv="foo"` – *required* – sets the video name, used for loading files (`foo.mp4`, `foo.webm`, etc.)
- `data-igv-loop` – optional – makes this an auto-playing, looping video, which will be paused whenever the element is no longer in view.
- `data-igv-scrollelement=".some-class"` – optional, only for use in conjunction with `data-igv-loop` – this sets the video's closest ancestor that matches the given selector as the element whose scroll position will be tracked (for auto-pausing purposes).
- `data-igv-playbutton` – adds a play button
- `data-igv-subtitles` – IGV will load a subs file too (`foo.srt`), and load a special version for iOS which has hardcoded subs (`foo.subs.mp4`).


JavaScript API
--------------

```javascript
IGV.debug = true; // to see debug info
IGV.visibilityThreshold = 50; // default=100
IGV.enableLoopingVideos = false; // eg, if (!Modernizr.videodesktop)

// Set video defaults for 
var defaults = {
  baseURL: '//interactivegraphics.ft-static.com/sites/2013/seasonal-appeal/videos/'
};

IGV.run(defaults, function () {
  // videos have now been set up
});
```


CSS
---

The IGV element has these classes added automatically: `igv`, `igv--playing`, `igv--paused`
