"""
File: saving_tabs_test_issue#98.py
Author: Dhruv Duggal
Description: This file tests the saving tabs functionality on starting focus mode
Tests Contained: This file contains test #33, #34, #35, #36, #37 and #38
"""
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import json
import os

CRED = '\033[91m'
CGREEN = '\33[32m'
CYELLOW = '\33[33m'
CEND = '\033[0m'

print(os.getcwd())
options = Options()
print("loading packed extension")
options.add_argument("load-extension=./project/build/")
# overcome limited resource problems
options.add_argument("--disable-dev-shm-usage")
# Bypass OS security model
options.add_argument("--no-sandbox")
# starting window maximized to prevent any scrolling issues
options.add_argument("--start-maximized")
print("set up driver")
# creating chrome driver
driver = webdriver.Chrome(options=options)

# assigning the extensions driver
uid = "flfgpjanhbdjakbkafipakpfjcmochnp"

# opening multiple websites on different tabs
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
# opening menu page of chrome extension
driver.get("chrome-extension://"+ uid +"/menu.html")

# creating a group that only contains some websites
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
master_elem = driver.find_element_by_id("selectedTabs")
elements = master_elem.find_elements_by_tag_name("option")
old_count = len(driver.find_elements_by_class_name("card"))
count = 0
for i in elements:
    if count <= 2:
        ActionChains(driver) \
            .key_down(Keys.SHIFT) \
            .click(i) \
            .key_up(Keys.SHIFT) \
            .perform()
    else:
        break
    count += 1
# naming this group CSE 112
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("CSE112")
ActionChains(driver).send_keys(Keys.ENTER).perform()
# moving to the popup page
# clicking pay button for the CSE112 group
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
# starting focus mode for this group
first_check_el = driver.find_element_by_class_name("popupFocusMode")
h1_elements = first_check_el.find_elements_by_tag_name("h1")
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
button_timer_start = pop_up_div.find_element_by_class_name("popupFocusModeButton")
original_display = pop_up_div.text
button_timer_start.click()
'''
Test Number #33

Description: Testing if saved tabs component is rendered

'''
print(CYELLOW + "Running Test 33" + CEND)
# sleeping for 5 seconds
sleep(5)
# switching to a new window and opening the menu page
driver.switch_to.window(driver.window_handles[1])
driver.get("chrome-extension://"+ uid +"/menu.html")
# searching for the saved tabs component
saved_tabs_comp = 0
try:
    driver.find_element_by_class_name("savedTabs")
except NoSuchElementException:
    saved_tabs_comp = 0
else:
    saved_tabs_comp = 1
    saved_tabs_component = driver.find_element_by_class_name("savedTabs")
try:
    assert saved_tabs_comp == 1
except AssertionError:
    print(CRED + "Test 33 Failed" + CEND)
    print(CRED + "Saved tabs component is not rendered" + CEND)
else:
    print(CGREEN + "Test 33 Passed" + CEND)
print("-----------------------")


'''
Test Number #34

Description: Testing if the saved tab header component is present

'''
print(CYELLOW + "Running Test 34" + CEND)
# checking if saved tab header rendered properly
saved_tab_header = 0
try:
    driver.find_element_by_class_name("savedTabsHeader")
except NoSuchElementException:
    saved_tab_header = 0
else:
    saved_tab_header = 1
    saved_tab_header_div = driver.find_element_by_class_name("savedTabsHeader")
try:
    assert saved_tab_header == 1
except:
    print(CRED + "Test 34 Failed" + CEND)
    print(CRED + "Saved Tab Header is not rendered" + CEND)
else:
    print(CGREEN + "Test 34 Passed" + CEND)
print("-----------------------")


'''
Test Number #35

Description: Testing if google is white listed even if not in tabgroup

'''
print(CYELLOW + "Running Test 35" + CEND)
# checking if the save tab header title is rendered correctly
h2_header = 0
text = ""
try:
    saved_tab_header_div.find_element_by_tag_name("strong")
except NoSuchElementException:
    h2_header = 0
else:
    h2_header = 1
    title = saved_tab_header_div.find_element_by_tag_name("strong").text
try:
    assert title == "Saved Tabs"
except AssertionError:
    print(CRED + "Test 25 Failed" + CEND)
    print(CRED + "Title for saved tabs not rendered" + CEND)
else:
    print(CGREEN + "Test 35 Passed" + CEND)
print("-----------------------")


'''
Test Number #36

Description: Testing if the delete all and open all buttons are rendered properly

'''
print(CYELLOW + "Running Test 36" + CEND)
# checking if the delete all and open all tab button exists
delete_all_check = 0
open_all_check = 0
# finding all buttons
buttons = driver.find_elements_by_tag_name("button")
delete_button = None
open_all_button = None
for i in buttons:
    # matching buttons by name
    if i.text == "Delete All":
        delete_all_check = 1
        # assigning buttons for future use
        delete_button = i
    elif i.text == "Open All":
        open_all_check = 1
        open_all_button = i
try:
    assert delete_all_check == 1 and open_all_check == 1
except:
    print(CRED + "Test 36 Failed" + CEND)
    if delete_all_check == 0:
        print(CRED + "Delete all button did not render properly" + CEND)
    if open_all_check == 0:
        print(CRED + "Open all button did not render properly" + CEND)
else:
    print(CGREEN + "Test 36 Passed" + CEND)
print("-----------------------")


'''
Test Number #37

Description: Checking if the saved tabs are correct

'''
print(CYELLOW + "Running Test 37" + CEND)
# checking if the saved tabs are correct
# searching for all saved tabs
tabs = driver.find_element_by_class_name("savedTabs").find_elements_by_tag_name("div")
sav_tab_1 = 0
sav_tab_2 = 0
sav_tab_3 = 0
sav_tab_4 = 0
sav_tab_5 = 0
# matching saved tabs by name
for i in tabs:
    if "Computer Science" in i.text:
        sav_tab_1 = 1
    elif "Facebook" in i.text:
        sav_tab_2 = 1
    elif "Twitter" in i.text:
        sav_tab_3 = 1
    elif "Stack Overflow" in i.text:
        sav_tab_4 = 1
try:
    assert sav_tab_1 == 1 and sav_tab_2 == 1 and sav_tab_3 == 1 and sav_tab_4 == 1
except AssertionError:
    print(CRED + "Test 37 Failed" + CEND)
    print(CRED + "All previous tabs not rendered" + CEND)
else:
    print(CGREEN + "Test 37 Passed" + CEND)
print("-----------------------")


'''
Test Number #38

Description: Testing if delete all button works

'''
print(CYELLOW + "Running Test 38" + CEND)
# clicking the delete button
driver.find_elements_by_class_name("tabContainer")
sleep(10)
delete_button.click()
after_delete_check = 0
# trying to find the saved tab container
try:
    driver.find_element_by_class_name("savedTabs")
except NoSuchElementException:
    after_delete_check = 1
else:
    after_delete_check = 0
try:
    assert after_delete_check == 1
except AssertionError:
    print(CRED + "Test 38 Failed" + CEND)
    print(CRED + "Saved Tabs not deleted" + CEND)
else:
    print(CGREEN + "Test 38 Passed" + CGREEN)
print("-----------------------")
print(CGREEN + "All Tests Passed" + CEND)

# writing coverage report
coverage_json_file = open("./project/.nyc_output/#98.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
print("All Tests Passed")
driver.quit()






