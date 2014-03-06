# ics.js

[![Build Status](http://img.shields.io/travis/maxmouchet/ics.js.svg)](https://travis-ci.org/maxmouchet/ics.js)
[![NPM Version](http://img.shields.io/npm/v/icsjs.svg)](#)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](#)

Pure JavaScript implementation of RFC 5545 (iCalendar).

## Overview

### Goals
- Being able to generate and fully parse iCal files.
- Pure JavaScript (ES5, strict mode) with no runtime dependencies.
- Node.js and browser compatibility.

## Installation

### Node.js

You can install it locally:
```
$ npm install icsjs
```
or you can add it as a dependency in your `package.json`:
```json
{ "dependencies" :
  {
    "icsjs" : "0.x"
  }
}
```

Then you just have to require it in your code:
```js
var iCalendar = require('icsjs');
```

### Browser

You just have to include it in your HTML:
```html
<script src="path/to/ics.js"></script>
```
and it will automatically expose the `iCalendar` object:  

[![DevTools screenshot](https://photos-3.dropbox.com/t/0/AABDQ89MqahZ5-_VkbHQBbbJFxm6V7Zz5Tg1a1qA1FA8VA/12/1765758/png/1024x768/3/1394121600/0/2/Screenshot%202014-03-06%2016.31.30.png/B1JDXwNRVofTWj9RQ3iY_HRL_IAwZZxDDYxMhJOneL4)](#)

## Usage

[Annotated source](http://maxmouchet.github.io/ics.js/docs/ics.html)

### Creating a calendar

```js
// Let's do a party right now.
var party = new iCalendar.EventBuilder();

party.setStartDate(new Date());
party.setDuration('PT3H0M0S');

party.setSummary('Crazy party at the beach');

// But don't forget tommorow's meeting.
var meeting = new iCalendar.EventBuilder();
var tommorow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

meeting.setStartDate(tommorow);
meeting.setDuration('PT1H0M0S');

meeting.setSummary("Financial result's presentation");

// Put that together in our calendar.
var calendar = new iCalendar.CalendarBuilder();
calendar.addEvent(party.getEvent());
calendar.addEvent(meeting.getEvent());

// And display it.
console.log(calendar.getCalendar().toString());
```
