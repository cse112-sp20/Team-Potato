from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
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

# This is only when using an unpacked version as UID key is not set until package is manually packed on the developer dashboard
driver.get("chrome://extensions")

uid = "flfgpjanhbdjakbkafipakpfjcmochnp"
driver.get("chrome-extension://" + uid + "/popup.html")

# Test 1: Checking if open tab button exists
open_tab_buttons = driver.find_elements_by_tag_name("button")
for i in open_tab_buttons:
    if i.text != "Start":
        open_tab_button = i
assert open_tab_button.text == "Open Potato Tab", "Should be 'Open Potato Tab'"


# Test 2: Checking if open tab moves us to menu.html
open_tab_button.click()
driver.switch_to.window(driver.window_handles[-1])
post_press_title = driver.title
assert post_press_title == "Potato Tab Menu", "Should be 'Potato Tab Menu'"

# Test 3: Check if tab group button exists
add_group_button = driver.find_element_by_class_name("addGroup")
assert add_group_button is not None, "Add group button should exists"

# Test 4: Check if tab group button creates a new group
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()
cards = driver.find_elements_by_class_name("card")
flag = 0
for i in cards:
    list_of_text = i.text
    if "Test Group" in i.text:
        flag = 1
        test_group = i

h3_header = test_group.find_element_by_tag_name("h5")
assert h3_header.text == "Test Group", "Group Button Does not work"
coverage_json_file = open("./project/.nyc_output/#15.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
print("Passed All Tests")
driver.quit()