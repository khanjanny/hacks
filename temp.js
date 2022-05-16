import os
import sys
import time, random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service

url = "https://knoxss.me/"


# Detect Platform
if "win" in sys.platform:
    driver = "driver.exe"
elif "linux" in sys.platform:
    driver = "driver"

# Service
path = os.path.join(os.getcwd(), 'driver/chrome' + driver)
service = Service(path)

#Options
options = Options()

# Driver Object
try:
    driver = webdriver.Chrome(options=options, service=service)
except:
    driver = webdriver.Chrome(options=options, executable_path=path)


chrome_prefs = {}
options.experimental_options["prefs"] = chrome_prefs
chrome_prefs["profile.default_content_settings"] = { "popups": 0 }

# options.binary_location = "/usr/bin/google-chrome"
# options.add_argument("user-data-dir=driver/chrome/chromedata")

options.add_argument("user-data-dir=./driver/chromecache")

driver = webdriver.Chrome(chrome_options=options)
driver.get(url)
