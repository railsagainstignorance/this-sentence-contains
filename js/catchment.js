var Catchment = (function() {
  INITIAL_RANGE = 30; // for generating the initial count of each letter

  UNITS  = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  TENS   = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  POWERS = ['zero', 'ten', 'hundred', 'thousand'];

  KNOWN_INTS = {}; // for memoizing all the numbers we come across

  // e.g. 102 -> "one hundred and two"
  var int_to_words = function( i ) {
    if (! Number.isInteger(i)) {
      return null;
    } else if (i in KNOWN_INTS) {
      return KNOWN_INTS[i];
    };

    var phrase;
    if (i < 0) {
      phrase = 'minus ' + int_to_words(-i);
    } else if(i < 20) {
      phrase = UNITS[i];
    } else if(i < 100) {
      var d = Math.floor(i / 10);
      var m = i % 10;
      phrase = TENS[d] + ((m>0)? ' ' + int_to_words(m) : '');
    } else if(i < 1000) {
      var d = Math.floor(i / 100);
      var m = i % 100;
      phrase = int_to_words(d) + ' ' + POWERS[2] + ((m>0)? ' and ' + int_to_words(m) : '');
    } else if(i < 10000) {
      var d = Math.floor(i / 1000);
      var m = i % 1000;
      phrase = int_to_words(d) + ' ' + POWERS[3] + ((m>0)? ' ' + int_to_words(m) : '');
    } else {
      phrase = 'more than 9999';
    }
    
    KNOWN_INTS[i] = phrase;
    return phrase;
  }



  var scan = function() {
      console.log("scanning now...");
      console.log("UNITS=" + UNITS);
      console.log("int_to_words(4176)=" + int_to_words(4176));
  }

  return {
    scan: function() {
      scan();
    }
  };

})();
