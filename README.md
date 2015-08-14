# "This sentence contains three As, two Bs, one C, one hundred and four Ds, ....., and two Zs."

The challenge is to find/construct a valid, self-referential sentence of the above form. 

You can trim down the search space a bit by applying a bit of up front effort, e.g. there is probably only one z, but the search space is still pretty large, and brute force is boring, so... see the code in `this_sentence_contains.rb` for a more interesting approach.

Originally noticed in Hofstader's book, Metamagical Themas, many years ago, I've found this is a fun little puzzle which is both a programming exercise and an exploration of some mildly counter-intuitive maths.

For further reading

   * https://en.wikipedia.org/wiki/Metamagical_Themas
   * https://en.wikipedia.org/wiki/Iterated_function#Fixed_points
   * https://en.wikipedia.org/wiki/100_prisoners_problem
   * https://en.wikipedia.org/wiki/Cycle_detection
   * https://en.wikipedia.org/wiki/Limit_cycle

To find a 'correct' sentence, just run the code

`$ ruby this_sentence_contains.rb`

-Chris

p.s. To expose details of the assorted cycles of sentences found along the way, including an estimate of the relative sizes of catchment areas for each cycle, try

`$ ruby catchment_area.rb`

p.p.s., here is a correct sentence

> This sentence contains three As, one B, three Cs, two Ds, thirty five Es, six Fs, two Gs, seven Hs, eleven Is, one J, one K, two Ls, one M, twenty two Ns, fifteen Os, one P, one Q, five Rs, twenty six Ss, twenty one Ts, one U, seven Vs, eight Ws, three Xs, five Ys, and one Z.


