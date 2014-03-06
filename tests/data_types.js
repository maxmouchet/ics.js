if (typeof module !== 'undefined' && module.exports) {
  var assert = require('assert');
  var iCalendar = require('../lib/ics.js');
}

describe('dataTypes', function() {

  describe('Binary', function() {

    var invalidBase64 = 'ABCDEF';
    var validBase64  = 'AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAgIAAAICAgADAwMAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMwAAAAAAABNEMQAAAAAAAkQgAAAAAAJEREQgAAACECQ0QgEgAAQxQzM0E0AABERCRCREQAADRDJEJEQwAAAhA0QwEQAAAAAEREAAAAAAAAREQAAAAAAAAkQgAAAAAAAAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

    describe('constructor', function() {
      it('should accept a valid Base64 string', function() {
        var binaryType = new iCalendar.dataTypes.Binary(validBase64);
        assert(true, binaryType instanceof iCalendar.dataTypes.Binary);
      });

      it('should throw an exception when data is an invalid Base64 string', function() {
        assert.throws(
          function() { new iCalendar.dataTypes.Binary(invalidBase64); },
          iCalendar.InvalidDataTypeException
        );
      });
    });

    describe('#toString()', function() {
      it('should return data as a string', function(){
        var binaryType = new iCalendar.dataTypes.Binary(validBase64);
        assert.equal(validBase64, binaryType.toString());
      });
    });
  });

  describe('Boolean', function() {

    var nativeBooleans = [ true, false ];
    var validBooleans = [ 'TRUE', 'false' ];
    var invalidBooleans = [ 0, '1' ];

    describe('constructor', function() {
      it('should accept valid booleans', function() {

        validBooleans.forEach(function(e, i, a) {
          var booleanType = new iCalendar.dataTypes.Boolean(e);
          assert(true, booleanType instanceof iCalendar.dataTypes.Boolean);
        });

      });

      it('should throw an exception when data is not a boolean', function() {
        
        invalidBooleans.forEach(function(e, i, a) {
          assert.throws(
            function() { new iCalendar.dataTypes.Boolean(e); },
            iCalendar.InvalidDataTypeException
          );
        });

      });
    });

    describe('.fromBoolean', function() {
      it('should accept native booleans', function() {

        nativeBooleans.forEach(function(e, i, a) {
          var booleanType = iCalendar.dataTypes.Boolean.fromBoolean(e);
          assert(true, booleanType instanceof iCalendar.dataTypes.Boolean);
        });

      });

      it('should throw an exception when data is not a boolean', function() {
        
        invalidBooleans.forEach(function(e, i, a) {
          assert.throws(
            function() { new iCalendar.dataTypes.Boolean.fromBoolean(e); },
            iCalendar.InvalidDataTypeException
          );
        });

      });
    });

  });

  describe('CalAddress', function() {

    // TODO: How to validate URIs ?
    var invalidURIs = [ 1234, 'qwerty' ];
    var validURI  = 'mailto:jane_doe@example.com';

    describe('constructor', function() {
      it('should accept a valid URI', function() {
        var calAddressType = new iCalendar.dataTypes.CalAddress(validURI);
        assert(true, calAddressType instanceof iCalendar.dataTypes.CalAddress);
      });

      it('should throw an exception when data is not an URI', function() {

        invalidURIs.forEach(function(e, i, a) {
          assert.throws(
            function() { new iCalendar.dataTypes.CalAddress(e); },
            iCalendar.InvalidDataTypeException
          );

        });
      });
    });

    describe('#toString()', function() {
      it('should return data as a string', function(){
        var calAddressType = new iCalendar.dataTypes.CalAddress(validURI);
        assert.equal(validURI, calAddressType.toString());
      });
    });

  });

});
