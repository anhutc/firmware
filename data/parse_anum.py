import re
import json
from typing import List, Dict

f = open('model.mediawiki', 'r')
data: Dict[str, str] = {}
anum: List[str] = []
identifier: str = ''
for line in f.readlines():
    if re.match('^\|', line) is None:
        continue
    line = re.sub('^\|[^|]+?\|', '|', line)
    line = re.sub('<\s*?br\s*?/?>', ',', line)
    line = re.sub('<.*?/?>', '', line)
    line = re.sub('\(.*?\)', '', line)
    matchObj = re.match('^\| (A\d{4}\s?(,A\d{4}\s?)*)$', line)
    if matchObj is not None:
        temp = matchObj.group(1).strip('\n').split(',')
        anum = [i.strip() for i in temp]
        #print(anum)
        #input()
        continue
    nextMatch = re.match('^\| ([A-Za-z]+\d+,\d+)$', line)
    if nextMatch is not None:
        identifier = nextMatch.group(1).strip('\n')
        #print(identifier)
        #input()
        for i in anum:
            data[i] = identifier
        if len(anum) == 0:
            print(identifier)
        anum = []
    if re.match('^\|-', line) is not None:
        for i in anum:
            data[i] = identifier
        anum = []

f.close()
del f

# patch: 
# remove Siri Remote (unknown in TIW)
del data["A1513"]
del data["A1962"]
del data["A2540"]

# [{'identifier': key, 'models': value} for key, value in data.items()]

with open('model.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
