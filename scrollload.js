function ScrollLoad (opts) {
  this._lastScroll = 0;
  this._ticking = false;

  // options
  opts = opts || {};

  this._optsUrl = opts.url || '/';
  this._optsThreshold = opts.threshold || 10;
  this._optsSuccess = opts.success || null;
  this._optsError = opts.error || null;
  this._optsPage = 2;
  this._optsLimit = opts.limit || 10;

  // scroll and resize event handler
  this._handlerBind = this._requestScroll.bind(this);

  // call to create
  this._create();
};

// Frames helper
ScrollLoad.prototype._requestScroll = function() {
  var currentScroll = window.pageYOffset;

  // check if scroll down
  if (currentScroll > this._lastScroll) {
    this._lastScroll = window.pageYOffset;

    this._requestTick();
  }

  if (this._optsPage >= 15) {
    // destroy on over 15 page
    this._destroy();
  }
};

ScrollLoad.prototype._requestTick = function() {

  if(!this._ticking) {
    // Make sure browser's support rAF
    requestAnimationFrame(this.update.bind(this));

    this._ticking = true;
  }
};

// ScrollLoad methods
ScrollLoad.prototype._create = function() {
  // fire scroll event once
  // this._handlerBind();

  // bind scroll and resize event
  window.addEventListener('scroll', this._handlerBind, false);
  window.addEventListener('resize', this._handlerBind, false);
};

ScrollLoad.prototype._destroy = function() {
  // unbind scroll and resize event
  window.removeEventListener('scroll', this._handlerBind, false);
  window.removeEventListener('resize', this._handlerBind, false);
};

ScrollLoad.prototype._inViewport = function() {
  // get viewport top and bottom offset
  var viewportTop = this._lastScroll;
  var viewportBottom = viewportTop + window.innerHeight;

  // get page height
  var pageHeight = document.body.scrollHeight || document.documentElement.scrollHeight;

  // calculate threshold, convert percentage to pixel value
  var threshold = (this._optsThreshold / 100) * window.innerHeight;

  // return if arrive in page bottom
  return pageHeight <= viewportBottom + threshold ;
};

ScrollLoad.prototype._getData = function(url) {
  var that = this;

  // get data by fetch, Make sure browser's support fetch
  fetch(url, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'RenderType': 'pagelet'
    }
  }).then(function (res) {
    // call the success function if success
    if (res.ok && typeof that._optsSuccess === 'function') {

      that._optsPage+=1;

      // allow for more animation frames
      that._ticking = false;

      res.json().then(function (data) {
        that._optsSuccess(data, that._destroy.bind(that));
      });

    } else {
      throw new Error('Fetch error: response status is ' + res.status);
    }
  }).catch(function(ex) {
    // call the error function if throw error
    if (typeof that._optsError === 'function') {
      that._optsError(ex);
    }
  });
};

ScrollLoad.prototype.update = function() {
  var url = "";

  // check if arrive in page bottom
  if(this._inViewport()) {
    // get data
    url += (/[?]/.test(this._optsUrl) ? '&' : '?') + 'page=' + this._optsPage + '&limit=' + this._optsLimit;
    this._getData(url);
  } else {
    // allow for more animation frames
    this._ticking = false;
  }
};
