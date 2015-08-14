# This code tries to find/construct a valid, self-referential sentence of the form:
# 	"This sentence contains three As, two Bs, one C, one hundred and four Ds, ....., and two Zs."

INITIAL_RANGE = 30 # for generating the initial count of each letter

UNITS  = %w{zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen}
TENS   = %w{zero ten twenty thirty forty fifty sixty seventy eighty ninety}
POWERS = %w{zero ten hundred thousand}

KNOWN_INTS = {} # for memoizing all the sentences we come across

# e.g. 102 -> "one hundred and two"
def int_to_words( i )
	return KNOWN_INTS[i] ||= if !i.is_a? Integer
		nil
	elsif i < 0
		'minus ' + int_to_words(-i)
	elsif i < 20
		UNITS[i]
	elsif i < 100
		d,m = i.divmod(10)
		TENS[d] + ((m>0)? ' ' + int_to_words(m) : '')
	elsif i < 1000
		d,m = i.divmod(100)
		int_to_words(d) + POWERS[2] + ((m>0)? ' and ' + int_to_words(m) : '')
	elsif i < 10000
		d,m = i.divmod(1000)
		int_to_words(d) + POWERS[3] + ((m>0)? int_to_words(m) : '')
	else
		'more than 9999'
	end
end

# e.g. "A", 23 -> "twenty three As"
def letter_count_to_words(p,count) 
	return int_to_words(count) + ' ' + p + ((count != 1)? 's' : ''); 
end

# From a sentence (could be any string, could be garbage, doesn't matter) count the frequency of each letter,
# construct a valid sentence using those frequency counts.
def contains_to_words(s) 
	counts = s.upcase.scan(/\w/).inject(Hash.new(0)){|h, c| h[c] += 1; h}
	return [
		"This sentence contains ",
		('A'..'Y').to_a.map{|p| letter_count_to_words(p,counts[p])}.join(', '),
		', and ',
		letter_count_to_words('Z',counts['Z']),
		'.'
	].join
end

# From a seed, iterate until we find a fixed point or a known non-fixed point.
# Return the fixed point, or nil.
def probe(s, known={}) 
	until known.has_key?(s)
		s2=contains_to_words(s)
		known[s]=s2
		s=s2
	end
	return (s==known[s])? s : nil
end

# Repeatedly generate a random seed and see where it goes, until we find a fixed point.
# Along the way print dots to indicate progress.
# Print some stats on how many sentences were covered. 
def keep_probing() 
	known={}
	i=0
	begin
		i += 1
		if i%1000==0
			print ',' 
		elsif i%100==0
			print '.'
		end 
		seed = ('A'..'Z').map{|c| c * rand(INITIAL_RANGE)}.join
		r=probe(seed, known)
	end until !r.nil?
	print "\nprobes=#{i}, knowns=#{known.size}\n"
	return r
end

r = keep_probing() 
print "#{r}\n"