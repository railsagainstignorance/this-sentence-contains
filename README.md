# "This sentence contains three As, two Bs, one C, one hundred and four Ds, ....., and two Zs."

The challenge is to find/construct a valid, self-referential sentence of the above form. 

You can trim down the search space a bit by applying a bit of up front effort, e.g. there is probably only one z, but the search space is still pretty large, and brute force is boring, so... 

Originally noticed in Hofstader's book, Metamagical Themas, many years ago, I've found this is a fun little puzzle which is both a programming exercise and an exploration of some mildly counter-intuitive maths.

For further reading

   * https://en.wikipedia.org/wiki/Metamagical_Themas
   * https://en.wikipedia.org/wiki/Iterated_function#Fixed_points
   * https://en.wikipedia.org/wiki/100_prisoners_problem
   * https://en.wikipedia.org/wiki/Cycle_detection
   * https://en.wikipedia.org/wiki/Limit_cycle
   * https://en.wikipedia.org/wiki/Attractor

To find a 'correct' sentence, just run the code

`$ ruby this_sentence_contains.rb`

-Chris

p.s., here is a correct sentence

> This sentence contains three As, one B, three Cs, two Ds, thirty five Es, six Fs, two Gs, seven Hs, eleven Is, one J, one K, two Ls, one M, twenty two Ns, fifteen Os, one P, one Q, five Rs, twenty six Ss, twenty one Ts, one U, seven Vs, eight Ws, three Xs, five Ys, and one Z.

and another, with slightly different wording

> This sentence really does contain four As, one B, three Cs, three Ds, thirty seven Es, nine Fs, one G, six Hs, eleven Is, one J, one K, four Ls, one M, twenty four Ns, fifteen Os, one P, one Q, ten Rs, twenty seven Ss, sixteen Ts, five Us, six Vs, three Ws, four Xs, five Ys, and one Z.

## Exploring the space

The set of all possible sentences with the same wording as above is infinite, since a sentence can state that it has an arbitrarily large number of As, etc. It is [countably infinite](https://en.wikipedia.org/wiki/Countable_set), with the same cardinality as the set of natural numbers.

That said, the effective search space is much smaller. Given the way this algorithm iterates, it seems clear (proof needed !!!) that no matter how large are the initial values in the sentence, within one step (or maybe two) the subsequent sentence has values which are much smaller, peaking in the 30s. It seems safe to say that after two steps, all subsequent values in the sentence are less than 100 (and mostly much less than this). Hence the search space is, in effect, finite. No matter where you start, you always end up in the same finite set of possible sentences.

Within that finite set, there may or may not be a fixed point, where the sentence is literally correct and the algorithm would iterate from that sentence straight back to itself. In fiddling with the sentence structure, it seems clear that you can easily define sentence structures for which this algorthm will never succeed (whether because there is truly no solution, or that it has become buried in such a way that brute force is the only option to find it). 

However, because the effective search space is finite, every sequence that enters has to end somewhere, otherwise it would not be finite. Where you end up is at a [limit cycle](https://en.wikipedia.org/wiki/Limit_cycle), i.e. a loop of sentences which lead round from one to other and back to the start of the loop. Once you hit a such a limit cycle, there is no point in continuing. A fixed point is simply a limit cycle of size 1.

No matter which sentence you start with, you will always end up at a limit cycle. 

To expose details of all the limit cycles of sentences found along the way, including an estimate of the relative sizes of catchment areas for each cycle, try

`$ ruby catchment_area.rb`
