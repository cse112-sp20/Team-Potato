"""
File: tabgroup_CRUD_test_issue#34.py
Author: Dhruv Duggal
Description: This file tests CRUD functions for tab groups are working properly
Tests Contained: This files contains test #10, #11, #12, #13, #14, #15, and #16
"""
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import json
import os

all_tests_check = 0
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

# assigning the extensions uid
uid = "flfgpjanhbdjakbkafipakpfjcmochnp"

# opening multiple tabs with different websites
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

# opening the menu.html page of the extension
driver.get("chrome-extension://"+ uid +"/menu.html")

'''
Test Number #10

Description: Testing if new tab is created with selection

'''
print(CYELLOW + "Running Test 10" + CEND)
# adding new tab group
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
master_elem = driver.find_element_by_id("selectedTabs")
elements = master_elem.find_elements_by_tag_name("option")
old_count = len(driver.find_elements_by_class_name("card"))
# selecting tabs to add to the tab group
for i in elements:
    ActionChains(driver) \
        .key_down(Keys.SHIFT) \
        .click(i) \
        .key_up(Keys.SHIFT) \
        .perform()
# naming the tab group
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()
new_count = len(driver.find_elements_by_class_name("card"))
# checking if the new tab group was created with selected tabs
try:
    assert new_count-old_count == 1
except AssertionError:
    print(CRED + "Test 10 Failed" + CEND)
    print(CRED + "New tab group was not created" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 10 Passed" + CEND)
print("-----------------------")

'''
Test Number #11

Description: Testing if name of previous tab group was set properly

'''
print(CYELLOW + "Running Test 11" + CEND)
# searching all tab groups
cards = driver.find_elements_by_class_name("card")
name_check = 0
div_to_search = None
header_to_search = None
for c in cards:
    # trying to find correct title
    if c.find_element_by_tag_name("h5").text == "Test Group":
        header_to_search = c.find_element_by_tag_name("h5")
        div_to_search = c
        name_check = 1
try:
    assert name_check == 1
except AssertionError:
    print(CRED + "Test 11 Failed" + CEND)
    print(CRED + "No tab group with name 'Test Group" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 11 Passed" + CEND)
print("-----------------------")

'''
Test Number #12

Description: Checking if tabs were properly added to the new tab group

'''
print(CYELLOW + "Running Test 5" + CEND)
check_tab_1 = 0
check_tab_2 = 0
check_tab_3 = 0
check_tab_4 = 0
check_tab_5 = 0

# getting all tab containers
grouping = div_to_search.find_element_by_class_name("card-body")
# searching through all tab containers and matching text
for g in grouping.find_elements_by_class_name("tabContainer"):
    if "Computer Science" in g.text:
        check_tab_1 = 1
    elif "Twitter" in g.text:
        check_tab_2 = 1
    elif "Facebook" in g.text:
        check_tab_3 = 1
    elif "Stack Overflow" in g.text:
        check_tab_4 = 1
try:
    assert check_tab_4 == 1 and check_tab_1 == 1 and check_tab_3 == 1 and check_tab_4 == 1
except AssertionError:
    print(CRED + "Test 12 Failed" + CEND)
    print(CRED + "Some or all tabs not added to tab group" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 12 Passed" + CEND)
print("-----------------------")

'''
Test Number #13

Description: Checking if we have two buttons, delete and edit

'''
print(CYELLOW + "Running Test 13" + CEND)
# checking if edit and delete buttons available
buttons_to_check = header_to_search.find_elements_by_tag_name("button")

try:
    assert len(buttons_to_check) == 2
except AssertionError:
    print(CRED + "Test 13 Failed" + CEND)
    print(CRED + "Either delete or edit button not rendering" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 13 Passed" + CEND)
print("-----------------------")

'''
Test Number #14

Description: Checking if editing functionality is working

'''
print(CYELLOW + "Running Test 14" + CEND)
# selecting first button (edit)
edit_button = buttons_to_check[0]
# clicking edit button
edit_button.click()

# changing the name of the tabgroup
edit_input = header_to_search.find_element_by_tag_name("input")
# clearing the previous name
edit_input.clear()
# setting new name
edit_input.send_keys("New Name")
edit_input.send_keys(Keys.ENTER)
# searching through all the tabgroups
cards = driver.find_elements_by_class_name("card")
# checking if tab group that was edited has been found
name_check_edit= 0
div_to_search_edit = None
new_header_to_search = None
cards = driver.find_elements_by_class_name("card")
for c in cards:
    if c.find_element_by_tag_name("h5").text == "New Name":
        name_check_edit = 1
        new_header_to_search = c.find_element_by_tag_name("h5")
try:
    assert name_check_edit == 1
except AssertionError:
    print(CRED+"Test 14 Failed" + CEND)
    print(CRED + "Editing name did not work properly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 14 Passed" + CEND)
print("-----------------------")

'''
Test Number #15

Description: Checking if re-editing functionality is working

'''
print(CYELLOW + "Running Test 15" + CEND)
# re doing the same functionality as above
buttons_to_check_2 = new_header_to_search.find_elements_by_tag_name("button")
edit_button = buttons_to_check_2[0]
edit_button.click()
edit_input = new_header_to_search.find_element_by_tag_name("input")
edit_input.send_keys(Keys.ENTER)

name_check_edit_2 = 0
div_to_search_edit_2 = None
header_to_search_edit_2 = None
final_header_to_search = None
cards = driver.find_elements_by_class_name("card")
for c in cards:
    if c.find_element_by_tag_name("h5").text == "New Name":
        name_check_edit_2 = 1
        final_header_to_search = c.find_element_by_tag_name("h5")
try:
    assert name_check_edit_2 == 1
except AssertionError:
    print(CRED+"Test 15 Failed" + CEND)
    print(CRED + "Re-editing name did not work properly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 15 Passed" + CEND)
print("-----------------------")

'''
Test Number #16

Description: Checking if delete buttons functionality is working
'''
print(CYELLOW + "Running Test 16" + CEND)
# searching for delete button
buttons_to_check = final_header_to_search.find_elements_by_tag_name("button")
delete_button = buttons_to_check[1]
# clicking delete button
delete_button.click()
# searching through tab groups
tab_groups = driver.find_element_by_class_name("tabGroups")
cards_final_check = tab_groups.find_elements_by_class_name("card")
# checking if tab groups are now len 0
try:
    assert len(cards_final_check) == 0
except AssertionError:
    print(CRED + "Test 16 Failed" + CEND)
    print(CRED + "Delete button not working" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 16 Passed" + CEND)
print("-----------------------")
assert all_tests_check == 0, CRED + "Some Tests Failed" + CEND
print(CGREEN + "All Tests Passed" + CEND)

# writing coverage report
coverage_json_file = open("./project/.nyc_output/#34.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()
