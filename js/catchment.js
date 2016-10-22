var Catchment = (function() {
  INITIAL_RANGE = 30; // for generating the initial count of each letter

  UNITS  = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  TENS   = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  POWERS = ['zero', 'ten', 'hundred', 'thousand'];

  KNOWN_INTS = {}; // for memoizing all the numbers we come across

  var scan = function() {
      console.log("scanning now...");
      console.log("UNITS=" + UNITS);
  }

  return {
    scan: function() {
      scan();
    }
  };

})();
