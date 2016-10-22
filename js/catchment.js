var Catchment = (function() {
  INITIAL_RANGE = 30; // for generating the initial count of each letter

  UNITS  = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  TENS   = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  POWERS = ['zero', 'ten', 'hundred', 'thousand'];

  KNOWN_INTS = {}; // for memoizing all the numbers we come across

  A_TO_Y = "ABCDEFGHIJKLMNOPQRSTUVWXY".split("");
  A_TO_Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // e.g. 102 -> "one hundred and two"
  var int_to_words = function( i ) {
    if (! Number.isInteger(i)) {
      return 'no';
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

  // e.g. "A", 23 -> "twenty three As"
  var letter_count_to_words = function(p,count){
    return int_to_words(count) + ' ' + p + ((count != 1)? 's' : ''); 
  }

  var count_letters = function(s){
    var accum;
    return s.toUpperCase().match(/[A-Z]/g).reduce(function(accum, val){ accum[val] = !(val in accum)? 1 : accum[val]+1; return accum; }, {});
  }

  // From a sentence (could be any string, could be garbage, doesn't matter) count the frequency of each letter,
  // construct a valid sentence using those frequency counts.
  var contains_to_words = function(s) { 
    var counts = count_letters(s);
    return [
      "This sentence contains ",
      A_TO_Y.map(function(p) { return letter_count_to_words(p,counts[p]); }).join(', '),
      ', and ',
      letter_count_to_words('Z',counts['Z']),
      '.'
      ].join("");
  }

  // returns the subset of the sequence which is the cycle or []
  var find_cycle_in_sequence = function( sequence ) {
    last_index  = sequence.length
    last_item   = sequence[last_index -1];
    first_index = sequence.indexOf(last_item);

    return (first_index == last_index)? [] : sequence.slice(first_index, (last_index -1));
  }

  // From a seed, iterate until we find a fixed point or a known non-fixed point.
  // Return the fixed point, or nil.
  var probe = function(s, known={}) { 
    if (!('knowns' in known)) {
      known['knowns'] = {};
    }

    var sequence = [s];
    while (! ( s in known['knowns']) ) {
      s2=contains_to_words(s);
      known['knowns'][s]=s2;
      sequence.push(s2); 
      s=s2;
    }

    var cycle = find_cycle_in_sequence(sequence);
    var cycle_id;
    if (cycle.length != 0) {
      console.log( "\nprobe: cycle found: length=" + cycle.length + "\n" );
      if (!('cycles' in known)) {
        known['cycles'] = [];
      }

      known['cycles'].push(cycle);
      cycle_id = known['cycles'].length -1;
    } else {
      cycle_id = known['knowns'][sequence[sequence.length -1]];
    }

    sequence.forEach( function(s){ known['knowns'][s] = cycle_id; } );

    if( cycle.length == 1 ) {
      console.log("\nprobe: sequence to fixed point:\n" + sequence.slice(0,-2).map(function(s){ 
        var counts=count_letters(s); 
        return A_TO_Z.map(function(p){ return counts[p]; }).join(','); }).join("\n") ); 
    }

    return (cycle.length == 1)? s : null;
  }

  // Repeatedly generate a random seed and see where it goes, until we find a fixed point.
  // Along the way print dots to indicate progress.
  // Print some stats on how many sentences were covered. 
  var keep_probing = function(){ 
    var known = {};
    var i=0;
    do {
      i += 1;
      if( i%1000==0 ){
        console.log(',');
      }
      var seed = A_TO_Z.map(function(c){ return Array(Math.floor(Math.random()*INITIAL_RANGE)).join(c); }).join("");
      r=probe(seed, known);
    } 
    while( r == null );
    console.log("\n\nprobes=" + i + ", knowns=" + Object.keys(known['knowns']).length+ "\n");

    var catchment_per_cycle = {};
    Object.keys(known['knowns']).forEach( function(k) {
      var c = known['knowns'][k];
      catchment_per_cycle[c] = (c in catchment_per_cycle)? catchment_per_cycle[c]+1 : 1; 
    } );

    console.log( "\ncycle catchments: " + Object.keys(catchment_per_cycle).map(function(c){ return catchment_per_cycle[c] + "(" + known['cycles'][c].length + ")"; }).join(', ') + "\n" );
    return { 
      "sentence": r,
      "known": known
     };
  }

  var generate_d3_data = function(known){
    var d3_data = Object.keys(known['knowns']).slice(1,1000).map(function(s){ return count_letters(s); });
    return d3_data;
  }

  var generate_cycles_d3_data = function(known){
    var d3_data = [];

    known['cycles'].forEach(function(cycle, i){
      var name = "cycle-" + i + "(" + cycle.length + ")";
      cycle.forEach(function(s){
        var d3_item = count_letters(s);
        d3_item['name'] = name;
        d3_data.push(d3_item);
      });
    });

    return d3_data;
  }

  var scan = function() {
      console.log("scanning now...");
      console.log("UNITS=" + UNITS);
      console.log("int_to_words(4176)=" + int_to_words(4176));
      console.log("letter_count_to_words('A',12)=" + letter_count_to_words('A',12));
      var sentence = 'a big apple';
      console.log("count_letters('" + sentence + "')=" + JSON.stringify(count_letters(sentence)));
      console.log("contains_to_words('" + sentence + "')=" + contains_to_words('a big apple'));
      var sequence = [1,2,3,4,5,6,7,5];
      console.log("find_cycle_in_sequence('"+ sequence + "')=" + find_cycle_in_sequence(sequence));
      var probe_out = probe(sentence, {});
      console.log("probe('" + sentence + "') = " + probe_out);
      var keep_probing_out = keep_probing();
      console.log("keep_probing()['sentence']=" + keep_probing_out['sentence']);
      var d3_data = generate_cycles_d3_data(keep_probing_out['known']);
      console.log("d3_data.length=" + d3_data.length);
      console.log("d3_data[0]=" + JSON.stringify(d3_data[0]));
      return {
        'sentence': keep_probing_out['sentence'],
        'd3_data': d3_data
      };
  }

  return {
    scan: function() {
      return scan();
    }
  };

})();

console.log("catchment: about to set event listener");

self.onmessage = function(e) {
  console.log('catchment: Message received from main script');
  console.log('catchment: starting scan');
  var scan_output = Catchment.scan();
  console.log('Scan completed. Posting scan_output back to main script');
  self.postMessage(scan_output);
}
