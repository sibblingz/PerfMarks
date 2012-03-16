#!/usr/bin/env python
import sys
import json
from decimal import *

getcontext().prec = 2

TYPES = ['rotate', 'translate', 'scale']

class PerfComparer:
  def __init__(self, fn1, fn2):
    # Load the two JSON files specified in the command line and parse them.
    self.json1 = self.load_json(fn1)
    self.json2 = self.load_json(fn2)

  def load_json(self, file_name):
    f = open(file_name)
    return json.load(f)

  def get_ua(self, json):
    return json['userData']['agentMetadata']['userAgent']

  def compare(self):
    out = ""

    # Get the useragent for both.
    out += 'A: %s\n' % self.get_ua(self.json1)
    out += 'B: %s\n---------\n' % self.get_ua(self.json2)

    # Generate a report.
    results1 = self.json1['userData']['results']['sprites']['image']
    results2 = self.json2['userData']['results']['sprites']['image']
    test_names = results1.keys()

    for test_name in test_names:
      for type_name in TYPES:
        if not type_name in results1[test_name] and \
           not type_name in results2[test_name]:
          continue;
        r1 = results1[test_name][type_name]['objectCount']
        r2 = results2[test_name][type_name]['objectCount']
        ratio = Decimal(r1) / Decimal(r2)

        if ratio > 1:
          out += '%s (%s) is %sx faster\n' % (test_name, type_name, ratio)
        else:
          out += '%s (%s) is %sx slower\n' % (test_name, type_name, 1/ratio)


    return out


if __name__ == '__main__':
  if len(sys.argv) is not 3:
    sys.exit(1)

  # Generate a report.
  pcomp = PerfComparer(sys.argv[1], sys.argv[2])
  print pcomp.compare()


