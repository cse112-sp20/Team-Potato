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
input_name.send_keys("CSE112")
ActionChains(driver).send_keys(Keys.ENTER).perform()
new_count = len(driver.find_elements_by_class_name("card"))

driver.get("chrome-extension://" + uid + "/popup.html")

menuContainer = driver.find_element_by_class_name("popupContainer")
cards = driver.find_elements_by_class_name("card")
target_group = None
for i in cards:
    if i.find_element_by_class_name("card-header").text == "CSE112":
        target_group = i

play_button_group = target_group.find_element_by_class_name("buttonGroup")
play_button = play_button_group.find_element_by_tag_name("button")

play_button.click()

first_check_el = driver.find_element_by_class_name("popupFocusMode")

# Checking if all the text elements are rendered
h1_elements = first_check_el.find_elements_by_tag_name("h1")
first_check = 0
second_check = 0
third_check = 0
final_check = 0
for i in h1_elements:
    if i.text == "Focus Mode":
        first_check = 1
    if i.text == "CSE112":
        second_check = 1
    if first_check == 1 and second_check == 1:
        final_check = 1
assert final_check == 1, "Focus Mode H1 elements not rendering"

pop_up_div = driver.find_element_by_class_name("popupFocusMode")
button_timer_start = pop_up_div.find_element_by_tag_name("button")
original_display = pop_up_div.text
#check 1 button timer text = start
assert button_timer_start.text == "Start Focus", "Button is not at start"
#check 2 button timer text = end after 1 click
button_timer_start.click()


driver.switch_to.window(driver.window_handles[4])
driver.get("chrome-extension://"+ uid +"/popup.html")
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
back_button_div = pop_up_div.find_element_by_class_name("btnContainer")
end_focus = pop_up_div.find_element_by_tag_name("button")
assert end_focus.text == "End Focus", "End Focus button not renedered"
end_focus.click()

back_buttons = pop_up_div.find_elements_by_tag_name("button")
back_button = None
for i in back_buttons:
    if i.text == "Go Back":
        back_button = i
back_button.click()


menuContainer = driver.find_element_by_class_name("popupContainer")
cards = driver.find_elements_by_class_name("card")
final_check = 0
for i in cards:
    if i.find_element_by_class_name("card-header").text == "CSE112":
        final_check = 1

assert final_check == 1, "Back button not working"
print("All Tests Passed")
coverage_json_file = open("./project/.nyc_output/#30_#36.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()