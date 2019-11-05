import json

def fun(variable):
	years = [2012, 2013, 2014, 2015, 2016, 2017]
	if variable['Year'] in years:
		return True
	else:
		return False

with open('gloabl_terrorism_dataset.json') as json_file:
	data = json.load(json_file)
	data = list(filter(fun, data))

	with open('filtered_dataset.json', 'w') as outfile:
	    json.dump(data, outfile)