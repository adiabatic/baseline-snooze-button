# Baseline Snooze Button

I like reading about new things that web browsers support, but I try to only care when they work in all three main browser engines and not just one or two.

This Deno program will read the contents of <https://github.com/web-platform-dx/web-features> that you’ve previously `git clone`d to your computer and spit out a long YAML list of features that are Baseline High (been working in all three engines for a while).

If you don’t care about people using slightly old browsers, modify the source around the `interestings` variable to filter for and sort on `baseline_low_date` instead of `baseline_high_date` and run it again.

## Making it go

Assuming you have Deno installed, run `deno task clone`, or inspect `deno.json` to see what Git repository you want to clone (maybe you prefer HTTPS clones).

Then run `deno task once`. You can, of course, run it more than once.

## Further work

It sure would be cool if someone made an [Atom][] feed of this kind of information.

[atom]: https://en.wikipedia.org/wiki/Atom_(web_standard)
