import json

output = []

with open('filtered_dataset.json') as json_file:
	data = json.load(json_file)
	result = {'Country':[],'Year':[],'Month':[],'Day':[],'AttackType':[],'casualities':[]}
	for d in data:
		if d['Country'] not in result['Country']:
			result['Country'].append(d['Country'])
		if d['Year'] not in result['Year']:
			result['Year'].append(d['Year'])
		if d['Month'] not in result['Month']:
			result['Month'].append(d['Month'])
		if d['Day'] not in result['Day']:
			result['Day'].append(d['Day'])
		if d['AttackType'] not in result['AttackType']:
			result['AttackType'].append(d['AttackType'])
		if d['casualities'] not in result['casualities']:
			result['casualities'].append(d['casualities'])

	result['Country'] = sorted(result['Country'])
	result['Year'] = sorted(result['Year'])
	result['Month'] = sorted(result['Month'])
	result['Day'] = sorted(result['Day'])
	result['AttackType'] = sorted(result['AttackType'])
	result['casualities'] = sorted(result['casualities'])
	output.append(result)




with open('extract_dataset.json', 'w') as outfile:
    json.dump(output, outfile)