import re
import json

f = open('model.mediawiki', 'r')
data = {}
anum = ''
for line in f.readlines():
    matchObj = re.match('\|(.*?\|)? ([A-Za-z]+\d+,\d+)$', line)
    if matchObj is not None:
        anum = matchObj.group(2).strip('\n')
        data[anum] = []
    nextMatch = re.match('^\| (M\w{4}(, M\w{4})*)$', line)
    if nextMatch is not None:
        arr = nextMatch.group(1).strip('\n').split(',')
        arr = [i.strip() for i in arr]
        data[anum].extend(arr)

print(data)

f.close()
del f

# patch:
# Those 2 A-number use same Model
data['AppleTV3,1'] = ['MD199']
data['AppleTV3,2'] = ['MD199']
# Remove Siri Remote
data["AppleTV11,1"] = ["MXGY2", "MXH02"]

with open('model-alter.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)
