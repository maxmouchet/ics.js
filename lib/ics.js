//     ics.js 0.0.1  
//     https://github.com/maxmouchet/ics.js  
//     (c) 2014 Maxime Mouchet  
//     ics.js may be freely distributed under the MIT license.  

(function() {
  'use strict';

  // Setup
  // =====

  // Setup code taken from [Underscore.js](http://underscorejs.org/docs/underscore.html).

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Create the iCalendar object.
  var iCalendar = {};

  // Export the iCalendar object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `iCalendar` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = iCalendar;
    }
    exports.iCalendar = iCalendar;
  } else {
    root.iCalendar = iCalendar;
  }

  // Current version.
  iCalendar.VERSION = '0.0.1';

  // Exceptions
  // ==========

  iCalendar.BadValueTypeException = function(message) {
    this.message = message;
    this.name = 'BadValueTypeException';
  };

  iCalendar.InvalidDataTypeException = function(message) {
    this.message = message;
    this.name = 'InvalidDataTypeException';
  };

  iCalendar.NotImplementedException = function() {
    this.name = 'NotImplementedException';
  };

  // Data Types
  // ==========

  iCalendar.dataTypes = {};

  // Base data type
  // --------------

  // This is the base data type for all the *Property Value Data Types* defined in [section 3.3](https://tools.ietf.org/html/rfc5545#section-3.3).
  iCalendar.dataTypes.Base = function(type, data) {
    if (arguments.length === 0) return;
    this._type = type;
    this.setData(data);
  };

  iCalendar.dataTypes.Base.prototype.setData = function(data) {
    this.data = this.validateData(data);
  };

  iCalendar.dataTypes.Base.prototype.validateData = function(data) {
    throw new iCalendar.NotImplementedException();
  };

  iCalendar.dataTypes.Base.prototype.toString = function() {
    return this.data;
  };

  // Binary Type
  // -----------

  // Implementation of the `BINARY` type defined in [section 3.3.1](https://tools.ietf.org/html/rfc5545#section-3.3.1).
  iCalendar.dataTypes.Binary = function(data) {
    iCalendar.dataTypes.Base.call(this, 'BINARY', data);
  };

  iCalendar.dataTypes.Binary.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Binary.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.Binary.prototype.validateData = function(data) {
    if (typeof data !== 'string') {
      throw new iCalendar.InvalidDataTypeException('Base64 string expected');
    }

    if (! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)) {
      throw new iCalendar.InvalidDataTypeException('Base64 string expected');
    }

    return data;
  };

  // iCalendar.dataTypes.Binary.from

  // Boolean Type
  // ------------

  // Implementation of the `BOOLEAN` type defined in [section 3.3.2](https://tools.ietf.org/html/rfc5545#section-3.3.2).
  iCalendar.dataTypes.Boolean = function(data) {
    iCalendar.dataTypes.Base.call(this, 'BOOLEAN', data);
  };

  iCalendar.dataTypes.Boolean.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Boolean.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.Boolean.prototype.validateData = function(data) {
    if (typeof data !== 'string') {
      throw new iCalendar.InvalidDataTypeException('String expected');
    }

    if (data.toUpperCase() !== ('TRUE' || 'FALSE')) {
      throw new iCalendar.InvalidDataTypeException('TRUE or FALSE expected');
    }

    return data;
  };

  iCalendar.dataTypes.Boolean.fromBoolean = function(bool) {
    if (typeof bool == 'boolean') {
      var data = bool ? 'TRUE' : 'FALSE';
      return new this(data);
    } else {
      throw new iCalendar.InvalidDataTypeException('Boolean expected');
    }
  };

  // Calendar User Address Type
  // --------------------------

  // Implementation of the `CAL-ADDRESS` type defined in [section 3.3.3](https://tools.ietf.org/html/rfc5545#section-3.3.3).
  iCalendar.dataTypes.CalAddress = function(data) {
    iCalendar.dataTypes.Base.call(this, 'CAL-ADDRESS', data);
  };

  iCalendar.dataTypes.CalAddress.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.CalAddress.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.CalAddress.prototype.validateData = function(data) {
    if (typeof data !== 'string') {
      throw new iCalendar.InvalidDataTypeException('String expected');
    }

    // TODO: How to validate URIs ?    

    return data;
  };

  // Date Type
  // ---------

  // Implementation of the `DATE` type defined in [section 3.3.4](https://tools.ietf.org/html/rfc5545#section-3.3.4).
  iCalendar.dataTypes.Date = function(data) {
    iCalendar.dataTypes.Base.call(this, 'DATE', data);
  };

  iCalendar.dataTypes.Date.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Date.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.Date.prototype.validateData = function(data) {
    if (typeof data !== 'string') {
      throw new iCalendar.InvalidDataTypeException('String expected');
    }

    if (! /^\d{8}$/.test(data)) {
      throw new iCalendar.InvalidDataTypeException();
    }

    return data;
  };

  iCalendar.dataTypes.Date.fromDate = function(date) {
    // TODO: Implement.
  };

  // Date-Time Type
  // --------------

  // Implementation of the `DATE-TIME` type defined in [section 3.3.5](https://tools.ietf.org/html/rfc5545#section-3.3.5).
  iCalendar.dataTypes.DateTime = function(data) {
    iCalendar.dataTypes.Base.call(this, 'DATE-TIME', data);
  };

  iCalendar.dataTypes.DateTime.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.DateTime.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.DateTime.prototype.validateData = function(data) {
    if (typeof data !== 'string') {
      throw new iCalendar.InvalidDataTypeException('String expected');
    }
    // TODO: Implement.
    return data;
  };

  iCalendar.dataTypes.DateTime.fromDate = function(date) {
    // TODO: LOCAL (Floating) OR UTC ??
    // YYYYDDMM T HHMMSS Z

    function pad(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }

    var data = date.getUTCFullYear() +
        pad( date.getUTCMonth() + 1 ) +
        pad( date.getUTCDate() ) +
        'T' + pad( date.getUTCHours() ) +
        pad( date.getUTCMinutes() ) +
        pad( date.getUTCSeconds() ) +
        'Z';

    return new this(data);
  };

  // Duration Type
  // -------------

  // Implementation of the `DURATION` type defined in [section 3.3.6](https://tools.ietf.org/html/rfc5545#section-3.3.6).
  iCalendar.dataTypes.Duration = function(data) {
    iCalendar.dataTypes.Base.call(this, 'DURATION', data);
  };

  iCalendar.dataTypes.Duration.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Duration.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.Duration.prototype.validateData = function(data) {
    if (typeof data !== 'string') {
      throw new iCalendar.InvalidDataTypeException('String expected');
    }

    // TODO: Add proper validation.

    // if (! /^\d{8}$/.test(data)) {
      // throw new iCalendar.InvalidDataTypeException();
    // }

    return data;
  };

  // Float Type
  // ----------

  // Implementation of the `FLOAT` type defined in [section 3.3.7](https://tools.ietf.org/html/rfc5545#section-3.3.7).
  iCalendar.dataTypes.Float = function(data) {
    iCalendar.dataTypes.Base.call(this, 'FLOAT', data);
  };

  iCalendar.dataTypes.Float.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Float.prototype.constructor = iCalendar.dataTypes.Base;

  // Integer Type
  // ------------

  // Implementation of the `Integer` type defined in [section 3.3.8](https://tools.ietf.org/html/rfc5545#section-3.3.8).
  iCalendar.dataTypes.Integer = function(data) {
    iCalendar.dataTypes.Base.call(this, 'INTEGER', data);
  };

  iCalendar.dataTypes.Integer.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Integer.prototype.constructor = iCalendar.dataTypes.Base;

  // Period of Time Type
  // -------------------

  // Implementation of the `PERIOD` type defined in [section 3.3.9](https://tools.ietf.org/html/rfc5545#section-3.3.9).
  iCalendar.dataTypes.Period = function(data) {
    iCalendar.dataTypes.Base.call(this, 'PERIOD', data);
  };

  iCalendar.dataTypes.Period.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Period.prototype.constructor = iCalendar.dataTypes.Base;

  // Recurrence Rule Type
  // --------------------

  // Implementation of the `RECUR` type defined in [section 3.3.10](https://tools.ietf.org/html/rfc5545#section-3.3.10).
  iCalendar.dataTypes.Recur = function(data) {
    iCalendar.dataTypes.Base.call(this, 'RECUR', data);
  };

  iCalendar.dataTypes.Recur.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Recur.prototype.constructor = iCalendar.dataTypes.Base;

  // Text Type
  // ---------

  // Implementation of the `TEXT` type defined in [section 3.3.11](https://tools.ietf.org/html/rfc5545#section-3.3.11).
  iCalendar.dataTypes.Text = function(data) {
    iCalendar.dataTypes.Base.call(this, 'TEXT', data);
  };

  iCalendar.dataTypes.Text.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Text.prototype.constructor = iCalendar.dataTypes.Base;

  iCalendar.dataTypes.Text.prototype.validateData = function(data) {
    // TODO: Implement.
    return data;
  };

  // Time Type
  // ---------

  // Implementation of the `TIME` type defined in [section 3.3.12](https://tools.ietf.org/html/rfc5545#section-3.3.12).
  iCalendar.dataTypes.Time = function(data) {
    iCalendar.dataTypes.Base.call(this, 'TIME', data);
  };

  iCalendar.dataTypes.Time.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.Time.prototype.constructor = iCalendar.dataTypes.Base;

  // URI Type
  // --------

  // Implementation of the `URI` type defined in [section 3.3.13](https://tools.ietf.org/html/rfc5545#section-3.3.13).
  iCalendar.dataTypes.URI = function(data) {
    iCalendar.dataTypes.Base.call(this, 'URI', data);
  };

  iCalendar.dataTypes.URI.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.URI.prototype.constructor = iCalendar.dataTypes.Base;

  // UTC Offset Type
  // ---------------

  // Implementation of the `UTC-OFFSET` type defined in [section 3.3.14](https://tools.ietf.org/html/rfc5545#section-3.3.14).
  iCalendar.dataTypes.UTCOffset = function(data) {
    iCalendar.dataTypes.Base.call(this, 'UTC-OFFSET', data);
  };

  iCalendar.dataTypes.UTCOffset.prototype = Object.create(iCalendar.dataTypes.Base.prototype);
  iCalendar.dataTypes.UTCOffset.prototype.constructor = iCalendar.dataTypes.Base;

  // Parameters
  // ==========

  iCalendar.parameters = {};

  // Base parameter
  // --------------

  iCalendar.parameters.Base = function(name, value) {
    this._name = name;
    if (typeof value !== 'undefined') { this.setValue(value); }
  };

  iCalendar.parameters.Base.prototype.setValue = function(value) {
    this.value = this.validateValue(value);
  };

  iCalendar.parameters.Base.prototype.validateValue = function(value) {
    throw new iCalendar.NotImplementedException();
  };

  iCalendar.parameters.Base.prototype.toString = function() {
    return this._name + '=' + this.value;
  };

  // Value Data Types Parameter
  // --------------------------

  // Implementation of the `VALUE` parameter defined in [section 3.2.20](https://tools.ietf.org/html/rfc5545#section-3.2.20).
  iCalendar.parameters.Value = function(value) {
    iCalendar.parameters.Base.call(this, 'VALUE', value);
  };

  iCalendar.parameters.Value.prototype = Object.create(iCalendar.parameters.Base.prototype);
  iCalendar.parameters.Value.prototype.constructor = iCalendar.parameters.Base;

  iCalendar.parameters.Value.prototype.validateValue = function(value) {
    if (typeof value !== 'string') { throw new BadValueTypeException(); }
    return value;
  };

  // Components
  // ==========

  iCalendar.components = {};

  // Base component
  // --------------

  iCalendar.components.Base = function(name) {
    this._name = name;
    this.properties = [];
  };

  iCalendar.components.Base.prototype.addProperty = function(property) {
    this.properties.push(this.validateProperty(property));
  };

  iCalendar.components.Base.prototype.validateProperty = function(property) {
    throw new iCalendar.NotImplementedException();
  };

  iCalendar.components.Base.prototype.removeProperty = function(property) {
    var index = this.properties.indexOf(property);
    if (index > -1) { this.properties.splice(index, 1); }
  };

  iCalendar.components.Base.prototype.toString = function() {
    var output = '';

    output += 'BEGIN:' + this._name + '\n';

    this.properties.forEach(function(e, i, a) {
      output += e.toString() + '\n';
    });

    output += 'END:' + this._name + '\n';

    return output;
  };


  // Event Component
  // ---------------

  // Implementation of the `VEVENT` component defined in [section 3.6.1](https://tools.ietf.org/html/rfc5545#section-3.6.1).
  iCalendar.components.Event = function() {
    iCalendar.components.Base.call(this, 'VEVENT');
  };

  iCalendar.components.Event.prototype = Object.create(iCalendar.components.Base.prototype);
  iCalendar.components.Event.prototype.constructor = iCalendar.components.Base;

  iCalendar.components.Event.prototype.validateProperty = function(property) {
    // TODO: Implement.
    return property;
  };

  // To-Do Component
  // ---------------

  // Implementation of the `VTODO` component defined in [section 3.6.2](https://tools.ietf.org/html/rfc5545#section-3.6.2).
  iCalendar.components.Todo = function() {
    iCalendar.components.Base.call(this, 'VTODO');
  };

  iCalendar.components.Todo.prototype = Object.create(iCalendar.components.Base.prototype);
  iCalendar.components.Todo.prototype.constructor = iCalendar.components.Base;

  // Journal Component
  // -----------------

  // Implementation of the `VJOURNAL` component defined in [section 3.6.3](https://tools.ietf.org/html/rfc5545#section-3.6.3).
  iCalendar.components.Journal = function() {
    iCalendar.components.Base.call(this, 'VJOURNAL');
  };

  iCalendar.components.Journal.prototype = Object.create(iCalendar.components.Base.prototype);
  iCalendar.components.Journal.prototype.constructor = iCalendar.components.Base;

  // Free/Busy Component
  // -------------------

  // Implementation of the `VFREEBUSY` component defined in [section 3.6.4](https://tools.ietf.org/html/rfc5545#section-3.6.4).
  iCalendar.components.FreeBusy = function() {
    iCalendar.components.Base.call(this, 'VFREEBUSY');
  };

  iCalendar.components.FreeBusy.prototype = Object.create(iCalendar.components.Base.prototype);
  iCalendar.components.FreeBusy.prototype.constructor = iCalendar.components.Base;

  // Time Zone Component
  // -------------------

  // Implementation of the `VTIMEZONE` component defined in [section 3.6.5](https://tools.ietf.org/html/rfc5545#section-3.6.5).
  iCalendar.components.TimeZone = function() {
    iCalendar.components.Base.call(this, 'VTIMEZONE');
  };

  iCalendar.components.TimeZone.prototype = Object.create(iCalendar.components.Base.prototype);
  iCalendar.components.TimeZone.prototype.constructor = iCalendar.components.Base;

  // Alarm Component
  // ---------------

  // Implementation of the `VALARM` component defined in [section 3.6.6](https://tools.ietf.org/html/rfc5545#section-3.6.6).
  iCalendar.components.Alarm = function() {
    iCalendar.components.Base.call(this, 'VALARM');
  };

  iCalendar.components.Alarm.prototype = Object.create(iCalendar.components.Base.prototype);
  iCalendar.components.Alarm.prototype.constructor = iCalendar.components.Base;


  // Properties
  // ==========

  iCalendar.properties = {};

  // Base property
  // -------------
  iCalendar.properties.Base = function(name, value) {
    this._name = name;
    this.parameters = [];
    if (typeof value !== 'undefined') { this.setValue(value); }
  };

  iCalendar.properties.Base.prototype.setValue = function(value) {
    this.value = this.validateValue(value);
  };

  iCalendar.properties.Base.prototype.addParameter = function(parameter) {
    // TODO: Validate parameter.
    this.parameters.push(parameter);
  };

  iCalendar.properties.Base.prototype.removeParameter = function(parameter) {
    var index = this.parameters.indexOf(parameter);
    if (index > -1) { this.parameters.splice(index, 1); }
  };

  iCalendar.properties.Base.prototype.toString = function() {
    var output = '';

    output += this._name;

    this.parameters.forEach(function(e, i, a) {
      output += ';' + e.toString();
    });

    output += ':' + this.value.toString();

    return output;
  };

  iCalendar.properties.Base.prototype.validateValue = function(value) {
    throw new iCalendar.NotImplementedException();
  };

  function expectValueType(value, expectedType) {
    if (!(value instanceof expectedType)) {
      // TODO: Correctly display expectedType
      throw new iCalendar.BadValueTypeException(typeof value + ' provided. ' + expectedType + ' was expected.');
    }
  }

  // Attachment Property
  // --------------------

  // Implementation of the `ATTACH` property defined in [section 3.8.1.1](https://tools.ietf.org/html/rfc5545#section-3.8.1.1).
  iCalendar.properties.Attachment = function(value) {
    iCalendar.properties.Base.call(this, 'ATTACH', value);
  };

  iCalendar.properties.Attachment.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.Attachment.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.Attachment.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.Binary);
    return value;
  };

  // Categories Property
  // ----------------

  // Implementation of the `CATEGORIES` property defined in [section 3.8.1.2](https://tools.ietf.org/html/rfc5545#section-3.8.1.2).
  iCalendar.properties.Categories = function(value) {
    iCalendar.properties.Base.call(this, 'CATEGORIES', value);
  };

  iCalendar.properties.Categories.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.Categories.prototype.constructor = iCalendar.properties.Base;

  // Classification Property
  // -----------------------

  // Implementation of the `CLASS` property defined in [section 3.8.1.3](https://tools.ietf.org/html/rfc5545#section-3.8.1.3).
  iCalendar.properties.Classification = function(value) {
    iCalendar.properties.Base.call(this, 'CLASS', value);
  };

  iCalendar.properties.Classification.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.Classification.prototype.constructor = iCalendar.properties.Base;

  // Comment Property
  // ----------------

  // Implementation of the `COMMENT` property defined in [section 3.8.1.4](https://tools.ietf.org/html/rfc5545#section-3.8.1.4).
  iCalendar.properties.Comment = function(value) {
    iCalendar.properties.Base.call(this, 'COMMENT', value);
  };

  iCalendar.properties.Comment.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.Comment.prototype.constructor = iCalendar.properties.Base;

  // Summary Property
  // ----------------

  // Implementation of the `SUMMARY` property defined in [section 3.8.1.12](https://tools.ietf.org/html/rfc5545#section-3.8.1.12).
  iCalendar.properties.Summary = function(value) {
    iCalendar.properties.Base.call(this, 'SUMMARY', value);
  };

  iCalendar.properties.Summary.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.Summary.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.Summary.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.Text);
    return value;
  };

  // Date-Time End Property
  // ------------------------

  // Implementation of the `DTEND` property defined in [section 3.8.2.2](https://tools.ietf.org/html/rfc5545#section-3.8.2.2).
  iCalendar.properties.DTEnd = function(value) {
    iCalendar.properties.Base.call(this, 'DTEND', value);
  };

  iCalendar.properties.DTEnd.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.DTEnd.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.DTEnd.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.DateTime);
    return value;
  }; 

  // Date-Time Start Property
  // ------------------------

  // Implementation of the `DTSTART` property defined in [section 3.8.2.4](https://tools.ietf.org/html/rfc5545#section-3.8.2.4).
  iCalendar.properties.DTStart = function(value) {
    iCalendar.properties.Base.call(this, 'DTSTART', value);
  };

  iCalendar.properties.DTStart.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.DTStart.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.DTStart.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.DateTime);
    return value;
  };

  // Duration Property
  // ------------------

  // Implementation of the `DURATION` property defined in [section 3.8.2.5](https://tools.ietf.org/html/rfc5545#section-3.8.2.5).
  iCalendar.properties.Duration = function(value) {
    iCalendar.properties.Base.call(this, 'DURATION', value);
  };

  iCalendar.properties.Duration.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.Duration.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.Duration.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.Duration);
    return value;
  }; 

  // Unique Identifier Property
  // ------------------------

  // Implementation of the `UID` property defined in [section 3.8.4.7](https://tools.ietf.org/html/rfc5545#section-3.8.4.7).
  iCalendar.properties.UID = function() {
    // UUID generation code from [http://stackoverflow.com/a/2117523/1262501](http://stackoverflow.com/a/2117523/1262501).
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    var value = new iCalendar.dataTypes.Text(uuid);

    iCalendar.properties.Base.call(this, 'UID', value);
  };

  iCalendar.properties.UID.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.UID.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.UID.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.Text);
    return value;
  };

  // Date-Time Stamp Property
  // ------------------------

  // Implementation of the `DTSTAMP` property defined in [section 3.8.7.2](https://tools.ietf.org/html/rfc5545#section-3.8.7.2).
  iCalendar.properties.DTStamp = function() {
    var value = iCalendar.dataTypes.DateTime.fromDate(new Date());
    iCalendar.properties.Base.call(this, 'DTSTAMP', value);
  };

  iCalendar.properties.DTStamp.prototype = Object.create(iCalendar.properties.Base.prototype);
  iCalendar.properties.DTStamp.prototype.constructor = iCalendar.properties.Base;

  iCalendar.properties.DTStamp.prototype.validateValue = function(value) {
    expectValueType(value, iCalendar.dataTypes.DateTime);
    return value;
  };


  // iCalendar Object
  // ================

  iCalendar.Calendar = function() {
    this.properties = [];
    this.components = [];
  };

  iCalendar.Calendar.prototype.addProperty = function(property) {
    // TODO: Validate.
    this.properties.push(property);
  };

  iCalendar.Calendar.prototype.removeProperty = function(property) {
    var index = this.properties.indexOf(property);
    if (index > -1) { this.properties.splice(index, 1); }
  };

  iCalendar.Calendar.prototype.addComponent = function(component) {
    // TODO: Validate.
    this.components.push(component);
  };

  iCalendar.Calendar.prototype.removeComponent = function(component) {
    var index = this.components.indexOf(component);
    if (index > -1) { this.components.splice(index, 1); }
  };

  iCalendar.Calendar.prototype.toString = function() {
    var output = '';

    // TODO: CRLF ?
    output += 'BEGIN:VCALENDAR' + '\n';
    output += 'VERSION:2.0' + '\n';
    // TODO: VALID FPI ?
    output += 'PRODID:-//maxmouchet/ics.js//NONSGML ics.js//EN' + '\n';

    this.components.forEach(function(e, i, a) {
      output += e.toString();
    });

    output += 'END:VCALENDAR';

    return output;
  };

  // Event builder
  // =============

  iCalendar.EventBuilder = function() {
    this.event = new iCalendar.components.Event();

    this.event.addProperty(new iCalendar.properties.UID());
    this.event.addProperty(new iCalendar.properties.DTStamp());
  };

  iCalendar.EventBuilder.prototype.setStartDate = function(startDate) {
    var dateTime = iCalendar.EventBuilder.createDate(startDate);

    var dtStart = new iCalendar.properties.DTStart(dateTime);
    dtStart.addParameter(new iCalendar.parameters.Value('DATE-TIME'));

    this.event.addProperty(dtStart);
  };

  iCalendar.EventBuilder.prototype.setEndDate = function(endDate) {
    var dateTime = iCalendar.EventBuilder.createDate(endDate);

    var dtEnd = new iCalendar.properties.DTEnd(dateTime);
    dtEnd.addParameter(new iCalendar.parameters.Value('DATE-TIME'));

    this.event.addProperty(dtEnd);
  };

  iCalendar.EventBuilder.prototype.setDuration = function(duration) {
    this.event.addProperty(
      new iCalendar.properties.Duration(
        new iCalendar.dataTypes.Duration(duration)
      )
    );
  };

  iCalendar.EventBuilder.prototype.setSummary = function(text) {
    this.event.addProperty(
      new iCalendar.properties.Summary(
        new iCalendar.dataTypes.Text(text)
      )
    );
  };

  iCalendar.EventBuilder.prototype.addAttachment = function(base64) {
    var attachment = new iCalendar.properties.Attachment(
      new iCalendar.dataTypes.Binary(base64)
    );

    attachment.addParameter(new iCalendar.parameters.Value('BINARY'));

    this.event.addProperty(attachment);
  };

  iCalendar.EventBuilder.prototype.getEvent = function() {
    // TODO: Validate event. It has REQUIRED properties.
    return this.event;
  };

  // TODO: Better place ?
  iCalendar.EventBuilder.createDate = function(date) {
    var dateTime;

    // TODO: Throw exception or do sth. when not valid.
    if (date instanceof Date) {
      dateTime = iCalendar.dataTypes.DateTime.fromDate(date);
    } else if (typeof date == 'string') {
      dateTime = new iCalendar.dataTypes.DateTime(date);
    }

    return dateTime;
  };

  // Calendar builder
  // ================

  iCalendar.CalendarBuilder = function() {
    this.calendar = new iCalendar.Calendar();
  };

  iCalendar.CalendarBuilder.prototype.addEvent = function(evt) {
    // TODO: addComponent better ?
    this.calendar.addComponent(evt);
  };

  iCalendar.CalendarBuilder.prototype.getCalendar = function() {
    return this.calendar;
  };

  // var event1 = new iCalendar.EventBuilder();
  // event1.setStartDate(new Date());
  // event1.setDuration('PT1H0M0S');
  // event1.addAttachment('c2FsdXQ=');
  // event1.setSummary('Party !');

  // var calendar = new iCalendar.CalendarBuilder();
  // calendar.addEvent(event1.getEvent());

  // console.log(calendar.getCalendar().toString());

  // TODO: moment.js integration ?
}).call(this);
