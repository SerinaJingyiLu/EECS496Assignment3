import json


with open('world.json') as json_file:
	data = json.load(json_file)
	result = {}
	for d in data["features"]:
		result[d["properties"]["name_long"]] = d

	with open('filtered_world.json', 'w') as outfile:
	    json.dump(result, outfile)