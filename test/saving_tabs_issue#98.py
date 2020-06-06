from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
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
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[5])
driver.get("https://instagram.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[6])
driver.get("https://netflix.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[7])
driver.get("https://github.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[8])
driver.get("chrome-extension://"+ uid +"/menu.html")

# created a group that only contains the https://cse.uscd.edu website
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
master_elem = driver.find_element_by_id("selectedTabs")
elements = master_elem.find_elements_by_tag_name("option")
old_count = len(driver.find_elements_by_class_name("card"))
count = 0
for i in elements:
    if count <= 5:
        ActionChains(driver) \
            .key_down(Keys.SHIFT) \
            .click(i) \
            .key_up(Keys.SHIFT) \
            .perform()
    else:
        break
    count += 1

model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("CSE112")
ActionChains(driver).send_keys(Keys.ENTER).perform()

# moving to the popup page
# clicking start on the the CSE112 group
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

h1_elements = first_check_el.find_elements_by_tag_name("h1")
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
button_timer_start = pop_up_div.find_element_by_class_name("popupFocusModeButton")
original_display = pop_up_div.text
button_timer_start.click()
sleep(0.3)
driver.switch_to.window(driver.window_handles[4])
driver.get("chrome-extension://"+ uid +"/menu.html")

# trying to find saved tabs component
saved_tabs_comp = 0
try:
    driver.find_element_by_class_name("savedTabs")
except NoSuchElementException:
    saved_tabs_comp = 0
else:
    saved_tabs_comp = 1
    saved_tabs_component = driver.find_element_by_class_name("savedTabs")
assert saved_tabs_comp == 1, "Saved Tabs Component is not rendered"

# checking if saved tab header rendered properly
saved_tab_header = 0
try:
    driver.find_element_by_class_name("savedTabsHeader")
except NoSuchElementException:
    saved_tab_header = 0
else:
    saved_tab_header = 1
    saved_tab_header_div = driver.find_element_by_class_name("savedTabsHeader")
assert saved_tab_header == 1, "Saved Tab Header is not rendered"

# checking if the save tab header title is rendered correctly
h2_header = 0
text = ""
try:
    saved_tab_header_div.find_element_by_tag_name("h2")
except NoSuchElementException:
    h2_header = 0
else:
    h2_header = 1
    title = saved_tab_header_div.find_element_by_tag_name("h2").text
assert title == "Saved Tabs", "Title for saved tabs not rendered"

# checking if the delete all and open all tab button exists
delete_all_check = 0
open_all_check = 0
buttons = driver.find_elements_by_tag_name("button")
delete_button = None
open_all_button = None
for i in buttons:
    if i.text == "Delete All":
        delete_all_check = 1
        delete_button = i
    elif i.text == "Open All":
        open_all_check = 1
        open_all_button = i
assert delete_all_check == 1 and open_all_check == 1, "Either delete all or open all button not checked properly"

# checking if the saved tabs are correct
tabs = driver.find_element_by_class_name("savedTabs").find_elements_by_tag_name("div")
sav_tab_1 = 0
sav_tab_2 = 0
sav_tab_3 = 0
sav_tab_4 = 0
sav_tab_5 = 0
sav_tab_6 = 0
sav_tab_7 = 0
sav_tab_8 = 0
sav_tab_9 = 0
for i in tabs:
    if "Computer Science" in i.text:
        sav_tab_1 = 1
    elif "Facebook" in i.text:
        sav_tab_2 = 1
    elif "Twitter" in i.text:
        sav_tab_3 = 1
    elif "Stack Overflow" in i.text:
        sav_tab_4 = 1
    elif "Piazza" in i.text:
        sav_tab_5 = 1
    elif "Instagram" in i.text:
        sav_tab_6 = 1
assert sav_tab_1 == 1 and sav_tab_2 == 1 and sav_tab_3 == 1 and sav_tab_4 == 1 and sav_tab_5 == 1 and sav_tab_6 == 1, "All previous tabs not rendered"

driver.find_elements_by_class_name("tabContainer")
sleep(10)
delete_button.click()
after_delete_check = 0

try:
    driver.find_element_by_class_name("savedTabs")
except NoSuchElementException:
    after_delete_check = 1
else:
    after_delete_check = 0

assert after_delete_check == 1, "Saved Tabs not deleted"
coverage_json_file = open("./project/.nyc_output/#98.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
print("All Tests Passed")
driver.quit()






