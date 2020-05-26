from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
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
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()

driver.get("chrome-extension://"+ uid +"/popup.html")

#also checking persistance of tab group on popup.html
cards = driver.find_elements_by_class_name("card")
pers_check = 0
for i in cards:
    if i.find_element_by_class_name("card-header").text == "Test Group":
        pers_check = 1
        h5_class = i.find_element_by_class_name("buttonGroup")

assert pers_check == 1, "Tab Group not persistent on popup.html"

play_button = h5_class.find_element_by_tag_name("button")
play_button.click()
focus_mode_check = 0
name_focus_mode_check = 0
sleep(1)
popup_view_fm = driver.find_element_by_class_name("popup-view-fm")

h1_elements = popup_view_fm.find_elements_by_tag_name("h1")
for h in h1_elements:
    if h.text == "Focus Mode":
        focus_mode_check = 1
    elif h.text == "Test Group":
        name_focus_mode_check = 1
assert focus_mode_check == 1,"Not moving to focus mode"
assert name_focus_mode_check == 1, "Not showing focus mode name"

start_button = popup_view_fm.find_element_by_tag_name("button")
start_button.click()
end_button = popup_view_fm.find_element_by_tag_name("button")
assert "End Focus" in end_button.text, "End focus button not changing on start"
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[1])
driver.get("https://netflix.com")
sleep(2)
h1_blocking = driver.find_element_by_tag_name("h1")
assert "This website is blocked" in h1_blocking.text, "Website not blocked"
print("All Tests Passed")
coverage_json_file = open("./project/.nyc_output/#73_#62.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()