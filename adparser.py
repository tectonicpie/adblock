import requests
import json
from sets import Set
import time, re, os
url_dict = dict()
cat_dict = dict()
bad_urls = set()
url = 'http://127.0.0.1:9001/ctwsd/websec'
count = 0
total = 0

res = open("filtered-list1.txt", "w")
start_time = time.clock()
print(str(time.clock()))
with open("file.txt") as f:
    content = f.readlines()
    for query in content:
		query = query.strip()
		# print(query)
		count += 1

		q_time = time.time()
		payload = 'x-ctch-request-type:classifyurl \nx-ctch-pver:1.0 \n\nx-ctch-url: ' + query
		#print(payload)
		headers = {'content-type': 'application/json'}
		#print(payload)
		r = requests.post(url, data=payload, headers=headers)

		lines = r.text.splitlines()
		line = lines[3]
		#print(query)
		#print(line[19:])
		cats = line[19:]
		var = cats.split(',')
		# url_dict[query] = set()
		for item in var:
			print("%s cat: %s" % (query,item))
			if str(item) == "0" or str(item) == "1" or str(item) == "2" or str(item) == "4" or str(item) == "5" or str(item) == "10" \
			or str(item) == "11" or str(item) == "12" or str(item) == "14" or str(item) == "16" or str(item) == "21" or str(item) == "22" or str(item) == "24" \
			or str(item) == "26" or str(item) == "34" or str(item) == "36" or str(item) == "46" or str(item) == "50" or str(item) == "51" \
			or str(item) == "63" or str(item) == "64" or str(item) == "65":
				if query not in bad_urls:
					bad_urls.add(query)
			# print(item)
			# url_dict[query].add(item)
			# res.write(query + " : " + item + " " + str(time.clock() - q_time) + "\n")
			# total = total + (time.clock() - q_time)
			# print(cat_dict)
			# if item not in cat_dict:
			# 	cat_dict[item] = set()
			# 	cat_dict[item].add(query)
			# else:
			# 	cat_dict[item].add(query)

		#print(len(url_dict))
		# if count == 100:
		# 	break

# for key in url_dict:
#   print key, url_dict[key]

# for item in s:

# res.write("Done with entire list, count: %s \n\n\n\n" % count)
# res.write("Time taken: %s \n\n\n" % (time.clock() - start_time))
# print(str(time.clock()))
# avg = total / count
# print(str(avg))

# list_dict = sorted(cat_dict, key=lambda k: len(cat_dict[k]), reverse=True)	
# for key in list_dict:
#    res.write(str(key) + " " + str(cat_dict[key]) + "\n")
for item in bad_urls:
	print(item)
	res.write(str("%s\n" % item))
res.close()
print("--- %s seconds ---" % (time.clock() - start_time))

