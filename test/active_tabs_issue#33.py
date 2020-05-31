from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import json
import os

print(os.getcwd())

options = webdriver.ChromeOptions()

print("loading packed extension")
options.add_argument("load-extension=./project/build/")
#options.add_extension('./build.crx')
options.add_argument("--disable-dev-shm-usage") # overcome limited resource problems
options.add_argument("--no-sandbox") # Bypass OS security model

driver = webdriver.Chrome(options=options)
uid = "flfgpjanhbdjakbkafipakpfjcmochnp"
driver.get("https://cse.ucsd.edu")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[1])
driver.get("https://facebook.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[2])
driver.get("https://twitter.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[3])
driver.get("https://stackoverflow.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[4])
driver.get("https://piazza.com")
driver.switch_to.window(driver.window_handles[4])
driver.get("chrome-extension://" + uid + "/menu.html")

active_tabs = driver.find_element_by_class_name("activeTabs")
list_of_active_tabs = active_tabs.find_elements_by_class_name("tabTitle")
check_tab_1 = 0
check_tab_2 = 0
check_tab_3 = 0
check_tab_4 = 0
check_tab_5 = 0
final_check_tab = 0
for i in list_of_active_tabs:
    if "Computer Science" in i.text:
        check_tab_1 = 1
    if "Facebook" in i.text:
        check_tab_2 = 1
    if "Twitter" in i.text:
        check_tab_3 = 1
    if "Stack Overflow" in i.text:
        check_tab_4 = 1
    if "Potato Tab Menu" in i.text:
        check_tab_5 = 1
    if check_tab_1 == 1 and check_tab_2 == 1 and check_tab_3 == 1 and check_tab_4 == 1 and check_tab_5 == 1:
        final_check_tab = 1
assert final_check_tab == 1, "Active Tabs are not correct"
print("All Tests Passed")

coverage_json_file = open("./project/.nyc_output/#33.json", "w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
