;(function (undefined) {
    "use strict";

    var defined = function (variable) {
        return (variable != undefined);
    };

    // Visibility.js allow you to know, that your web page is in the background
    // tab and thus not visible to the user. This library is wrap under
    // Page Visibility API. It fix problems with different vendor prefixes and
    // add high-level useful functions.
    var self = window.Visibility = {

        // Call callback only when page become to visible for user or
        // call it now if page is visible now or Page Visibility API
        // doesn’t supported.
        //
        // Return false if API isn’t supported, true if page is already visible
        // or listener ID (you can use it in `unbind` method) if page isn’t
        // visible now.
        //
        //   Visibility.onVisible(function () {
        //       startIntroAnimation();
        //   });
        onVisible: function (callback) {
            if ( !self.isSupported() || !self.hidden() ) {
                callback();
                return self.isSupported();
            }

            var listener = self.change(function (e, state) {
                if ( !self.hidden() ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Call callback when visibility will be changed. First argument for
        // callback will be original event object, second will be visibility
        // state name.
        //
        // Return listener ID to unbind listener by `unbind` method.
        //
        // If Page Visibility API doesn’t supported method will be return false
        // and callback never will be called.
        //
        //   Visibility.change(function(e, state) {
        //       Statistics.visibilityChange(state);
        //   });
        //
        // It is just proxy to `visibilitychange` event, but use vendor prefix.
        change: function (callback) {
            if ( !self.isSupported() ) {
                return false;
            }
            self._lastCallback += 1;
            var number = self._lastCallback;
            self._callbacks[number] = callback;
            self._setListener();
            return number;
        },

        // Remove `change` listener by it ID.
        //
        //   var id = Visibility.change(function(e, state) {
        //       firstChangeCallback();
        //       Visibility.unbind(id);
        //   });
        unbind: function (id) {
            delete self._callbacks[id];
        },

        // Call `callback` in any state, expect “prerender”. If current state
        // is “prerender” it will wait until state will be changed.
        // If Page Visibility API doesn’t supported, it will call `callback`
        // immediately.
        //
        // Return false if API isn’t supported, true if page is already after
        // prerendering or listener ID (you can use it in `unbind` method)
        // if page is prerended now.
        //
        //   Visibility.afterPrerendering(function () {
        //       Statistics.countVisitor();
        //   });
        afterPrerendering: function (callback) {
            if ( !self.isSupported() || 'prerender' != self.state() ) {
                callback();
                return self.isSupported();
            }

            var listener = self.change(function (e, state) {
                if ( 'prerender' != state ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Return true if page now isn’t visible to user.
        //
        //   if ( !Visibility.hidden() ) {
        //       VideoPlayer.play();
        //   }
        //
        // It is just proxy to `document.hidden`, but use vendor prefix.
        hidden: function () {
            return self._prop('hidden', false);
        },

        // Return visibility state: 'visible', 'hidden' or 'prerender'.
        //
        //   if ( 'prerender' == Visibility.state() ) {
        //       Statistics.pageIsPrerendering();
        //   }
        //
        // Don’t use `Visibility.state()` to detect, is page visible, because
        // visibility states can extend in next API versions.
        // Use more simpler and general `Visibility.hidden()` for this cases.
        //
        // It is just proxy to `document.visibilityState`, but use
        // vendor prefix.
        state: function () {
            return self._prop('visibilityState', 'visible');
        },

        // Return true if browser support Page Visibility API.
        //
        //   if ( Visibility.isSupported() ) {
        //       Statistics.startTrackingVisibility();
        //       Visibility.change(function(e, state)) {
        //           Statistics.trackVisibility(state);
        //       });
        //   }
        isSupported: function () {
            return defined(self._prefix());
        },

        // Link to document object to change it in tests.
        _doc: window.document,

        // Vendor prefix cached by `_prefix` function.
        _chechedPrefix: null,

        // Is listener for `visibilitychange` event is already added
        // by `_setListener` method.
        _listening: false,

        // Last timer number.
        _lastCallback: -1,

        // Callbacks from `change` method, that wait visibility changes.
        _callbacks: { },

        // Variable to check hidden-visible state changes.
        _hiddenBefore: false,

        // Initialize variables on page loading.
        _init: function () {
            self._hiddenBefore = self.hidden();
        },

        // Detect vendor prefix and return it.
        _prefix: function () {
            if ( null !== self._chechedPrefix ) {
                return self._chechedPrefix;
            }
            if ( defined(self._doc.visibilityState) ) {
                return self._chechedPrefix = '';
            }
            if ( defined(self._doc.webkitVisibilityState) ) {
                return self._chechedPrefix = 'webkit';
            }
        },

        // Return property name with vendor prefix.
        _name: function (name) {
            var prefix = self._prefix();
            if ( '' == prefix ) {
                return name;
            } else {
                return prefix +
                    name.substr(0, 1).toUpperCase() + name.substr(1);
            }
        },

        // Return document’s property value with name with vendor prefix.
        // If API is not support, it will retun `unsupported` value.
        _prop: function (name, unsupported) {
            if ( !self.isSupported() ) {
                return unsupported;
            }
            return self._doc[self._name(name)];
        },

        // Listener for `visibilitychange` event.
        _onChange: function(event) {
            var state = self.state();

            for ( var i in self._callbacks ) {
                self._callbacks[i].call(self._doc, event, state);
            }

            self._hiddenBefore = self.hidden();
        },

        // Set listener for `visibilitychange` event.
        _setListener: function () {
            if ( self._listening ) {
                return;
            }
            var event = self._prefix() + 'visibilitychange';
            var listener = function () {
                self._onChange.apply(Visibility, arguments);
            };
            if ( self._doc.addEventListener ) {
                self._doc.addEventListener(event, listener, false);
            } else {
                self._doc.attachEvent(event, listener);
            }
            self._listening = true;
            self._hiddenBefore = self.hidden();
        }

    };

    self._init();

})();


;(function () {
    "use strict";

    var defined = function(variable) {
        return ('undefined' != typeof(variable));
    };

    var self = Visibility;

    var timers = {

      // Run callback every `interval` milliseconds if page is visible and
      // every `hiddenInterval` milliseconds if page is hidden.
      //
      //   Visibility.every(60 * 1000, 5 * 60 * 1000, function () {
      //       checkNewMails();
      //   });
      //
      // You can skip `hiddenInterval` and callback will be called only if
      // page is visible.
      //
      //   Visibility.every(1000, function () {
      //       updateCountdown();
      //   });
      //
      // It is analog of `setInterval(callback, interval)` but use visibility
      // state.
      //
      // It return timer ID, that you can use in `Visibility.stop(id)` to stop
      // timer (`clearInterval` analog).
      // Warning: timer ID is different from interval ID from `setInterval`,
      // so don’t use it in `clearInterval`.
      //
      // On change state from hidden to visible timers will be execute.
      every: function (interval, hiddenInterval, callback) {
          self._initTimers();

          if ( !defined(callback) ) {
              callback = hiddenInterval;
              hiddenInterval = null;
          }
          self._lastTimer += 1;
          var number = self._lastTimer;
          self._timers[number] = ({
              interval:       interval,
              hiddenInterval: hiddenInterval,
              callback:       callback
          });
          self._runTimer(number, false);

          if ( self.isSupported() ) {
              self._setListener();
          }
          return number;
      },

      // Stop timer from `every` method by it ID (`every` method return it).
      //
      //   slideshow = Visibility.every(5 * 1000, function () {
      //       changeSlide();
      //   });
      //   $('.stopSlideshow').click(function () {
      //       Visibility.stop(slideshow);
      //   });
      stop: function(id) {
          var timer = self._timers[id]
          if ( !defined(timer) ) {
              return false;
          }
          self._stopTimer(id);
          delete self._timers[id];
          return timer;
      },

      // Last timer number.
      _lastTimer: -1,

      // Callbacks and intervals added by `every` method.
      _timers: { },

      // Is setInterval method detected and listener is binded.
      _timersInitialized: false,

      // Initialize variables on page loading.
      _initTimers: function () {
          if ( self._timersInitialized ) {
              return;
          }
          self._timersInitialized = true;

          self.change(function () {
              self._timersStopRun()
          });
      },

      // Set interval by `setInterval`. Allow to change function for tests or
      // syntax sugar in `interval` arguments.
      _setInterval: function (callback, interval) {
          return setInterval(callback, interval);
      },

      // Try to run timer from every method by it’s ID. It will be use
      // `interval` or `hiddenInterval` depending on visibility state.
      // If page is hidden and `hiddenInterval` is null,
      // it will not run timer.
      //
      // Argument `now` say, that timers must be execute now too.
      _runTimer: function (id, now) {
          var interval,
              timer = self._timers[id];
          if ( self.hidden() ) {
              if ( null === timer.hiddenInterval ) {
                  return;
              }
              interval = timer.hiddenInterval;
          } else {
              interval = timer.interval;
          }
          if ( now ) {
              timer.callback.call(window);
          }
          timer.id = self._setInterval(timer.callback, interval);
      },

      // Stop timer from `every` method by it’s ID.
      _stopTimer: function (id) {
          var timer = self._timers[id];
          clearInterval(timer.id);
          delete timer.id;
      },

      // Listener for `visibilitychange` event.
      _timersStopRun: function (event) {
          var isHidden = self.hidden(),
              hiddenBefore = self._hiddenBefore;

          if ( (isHidden && !hiddenBefore) || (!isHidden && hiddenBefore) ) {
              for ( var i in self._timers ) {
                  self._stopTimer(i);
                  self._runTimer(i, !isHidden);
              }
          }
      }

    };

    for ( var prop in timers ) {
        Visibility[prop] = timers[prop];
    }

})();