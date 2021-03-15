import configparser
import platform
import os
from urllib.request import urlopen
from io import BytesIO
from zipfile import ZipFile

config = configparser.ConfigParser()
config.read("drivers.ini")
filename = config['os'][platform.system()]
driver_url= "%s%s" % (config['default']['version'], filename)

print('Beginning file download with urllib2...')
print(os.getcwd( ))

if not os.path.isdir(os.path.join(os.getcwd(), 'config', 'drivers')):
	os.mkdir('config/drivers')	

with urlopen(driver_url) as zpfile:
    with ZipFile(BytesIO(zpfile.read())) as zfile:
        zfile.extractall("%s" % (os.path.join(os.getcwd(), 'config', 'drivers')))

