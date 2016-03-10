# ScrollLoad

A small scroll loading plugin for modern browser.

## Browser Support

ScrollLoad is not compatible with all platforms, it's depends on the following browser APIs:

- requestAnimationFrame
- fetch

To support older browsers, you need consider including polyfill.

## Simple Usage

Include JS file to our html. In your html file:

```html
<script src="scrollload.js"></script>
```

Creating an instance of scrollload.js

```javascript
var scrollLoad = new ScrollLoad({
  url: '/api/index.json',
  threshold: 20,
  limit: 10,
  success: function (data, unbind) {
    if (data) {
      console.log(data);
    } else {
      unbind();
    }
  },
  error: function (err) {
    console.log("Error", err);
  }
});
```

## Options

Default options are shown below:

```javascript
var scrollLoad = new ScrollLoad({
  url: '/',
  threshold: 10,
  limit: 10,
  success: null,
  error: null
});
```

### url

Fetch url to get data

### threshold

Adjust when data load, relative to the viewport.

Threshold is a percentage of the viewport height, identical to the CSS vh unit.

### limit

Limit when data load.

### success

Callback function, the success when get response. Receives response json and destroy event callback as arguments.

### error

Callback function, will be executed when fetch throw error.
