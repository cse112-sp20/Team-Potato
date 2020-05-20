from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import os

print(os.getcwd())

options = webdriver.ChromeOptions()

print("loading packed extension")
options.add_argument("load-extension=./project/build/")
#options.add_extension('./build.crx')
options.add_argument("--disable-dev-shm-usage") # overcome limited resource problems
options.add_argument("--no-sandbox") # Bypass OS security model

driver = webdriver.Chrome(options=options)
# This is only when using an unpacked version as UID key is not set until package is manually packed on the developer dashboard

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
driver.get("chrome-extension://"+ uid +"/popup.html")

# check 1, checking popup.html now contains "work" and "play"
popup_div = driver.find_element_by_class_name("menuContainer")
popup_popup = driver.find_elements_by_class_name("card")
assert popup_popup is not None, "Popup section of page not present"

#check 2, checking if without changes the popup segment shows "work" and "play" sections
card_divs = driver.find_elements_by_class_name("card")
assert len(card_divs) == 2, "only " + len(card_divs) + " showing up, meant to be 2"
check_1 = 0
check_2 = 0
work_div = None
play_div = None
for i in card_divs:
    header = i.find_element_by_class_name("card-header")
    if header.text == "work":
        work_div = i
        check_1 = 1
    elif header.text == "play":
        play_div = i
        check_2 = 1
assert check_2 == 1 and check_1 == 1, "work/play tabs not being displayed"

driver.get("chrome-extension://"+ uid +"/menu.html")

add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
master_elem = driver.find_element_by_id("selectedTabs")
elements = master_elem.find_elements_by_tag_name("option")
old_count = len(driver.find_elements_by_class_name("card"))
for i in elements:
    ActionChains(driver) \
        .key_down(Keys.SHIFT) \
        .click(i) \
        .key_up(Keys.SHIFT) \
        .perform()
model_body = driver.find_element_by_class_name("modal-body")
ActionChains(driver).send_keys(Keys.ENTER).perform()
new_count = len(driver.find_elements_by_class_name("card"))
assert new_count-old_count == 1, "new tabgroup added"
print("All Tests Passed")

import json
coverage_json_file = open("./raw_coverage/34.json","w+")
coverage_json_file.write(json.dump(driver.execute_script("return window.__coverage__;")))
coverage_json_file.close()