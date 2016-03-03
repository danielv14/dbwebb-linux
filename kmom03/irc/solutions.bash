#!/bin/bash

# Solution to 1.
wc -l ircLog.txt > a.txt
# Solution to 2.
grep -E 'pansar.*notepad' ircLog.txt > b.txt
# Solution to 3.
wc -w ircLog.txt > c.txt
# Solution to 4.
tail -n 4 ircLog.txt > d.txt
# Solution to 5.
grep -m 1 'Log opened' ircLog.txt > e.txt
# Solution to 6.
grep -m 3 'wasa' ircLog.txt | tail -n 1 > f.txt
# Solution to 7.
grep -c '11:15' ircLog.txt > g.txt
# Solution to 8.
grep -m 10 'Wed Jun 17 2015' ircLog.txt > h.txt
# Solution to 9.
grep -E '19:.*htmlphp|19:.*projekt' ircLog.txt > i.txt
# Solution to 12.
grep -Em 1 '07:48.*pansar' ircLog.txt > l.txt
