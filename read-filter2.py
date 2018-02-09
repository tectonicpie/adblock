import json, requests
import urllib2, cookielib
import time, re, os

from sets import Set

s = Set()

pattern=r'((http|https)+:\/\/)*[(\.*a-z A-Z\d\-)]+(\.[a-z A-Z])([\/*|a-z*|A-Z*|\d*|\.*|\$*| \=*| \?*| \**| \[*| \]*| _*| \(*| \)* \#]*-*)+'

hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}

url = 'https://api.filterlists.com/v1/lists/'
link = 'https://easylist-downloads.adblockplus.org/adwarefilters.txt'
  
start_time = time.time()
# resp = requests.get(url=url)

with open('filterlist.json') as data_file:    
    data = json.load(data_file)
    for x in range(0, len(data)-1):
        req = urllib2.Request(data[x]["viewUrl"], headers=hdr)
        try:
            page = urllib2.urlopen(req)
        except urllib2.HTTPError, e:
            print e.fp.read()

        content = page.read()
        file = open("url_content.txt","w") 
        file.write(content)
        file.close()
        with open("url_content.txt") as f:
            content = f.readlines()
            for line in content:
                tokens=line.split()
                for token in tokens:
                    matched=re.search(pattern,token,re.M|re.I)
                    if(matched):
                        if(matched.group().strip() == "www.google.com"):
                            print("Google found in %s" % data[x]["viewUrl"])
                        if(matched.group().strip() not in s):
                            s.add(matched.group().strip())
                            #print(matched.group().strip())
        f.close()
        os.remove("url_content.txt")
        print("Done with %s" % data[x]["viewUrl"])
        print(len(s))
        print("--- %s seconds ---" % (time.time() - start_time))
data_file.close()
print("done")
print(len(s))
print("--- %s seconds ---" % (time.time() - start_time))

res = open("complete_list.txt", "w")
for item in s:
    res.write(item + "\n")
res.close()

