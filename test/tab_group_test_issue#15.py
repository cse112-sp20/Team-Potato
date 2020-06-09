"""
File: tab_group_test_issue#15.py
Author: Dhruv Duggal
Description: This file checks whether tab groups are being created properly
Tests Contained: This files contains test #3, #4 and #5
"""
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import json
import os
all_tests_check = 0
CRED = '\033[91m'
CGREEN = '\33[32m'
CYELLOW = '\33[33m'
CEND = '\033[0m'

print(os.getcwd())
options = webdriver.ChromeOptions()

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
# opening the popup.html page
driver.get("chrome-extension://" + uid + "/popup.html")

'''
Test #3

Description: This test checks whether the "Open Flow Tab Menu" is rendered properly
'''
print(CYELLOW + "Running Test 3" + CEND)
# finding the open Flow Tab Menu
open_tab_buttons = driver.find_elements_by_tag_name("button")
for i in open_tab_buttons:
    if i.text != "Start":
        open_tab_button = i
try:
    assert open_tab_button.text == "Open Flow"
except AssertionError:
    print(CRED + "Test 3 Failed" + CEND)
    print(CRED + "Open Flow button not rendered" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 3 Passed")
print("-----------------------")

'''
Test #4

Description: This test checks whether the "Open Flow Tab Menu" is working properly

'''
print(CYELLOW + "Running Test 4" + CEND)
# clicking on the open Flow tab button
open_tab_button.click()
# checking if the new tab opened is correct
driver.switch_to.window(driver.window_handles[-1])
post_press_title = driver.title
try:
    assert post_press_title == "Flow Menu"
except AssertionError:
    print(CRED +"Test 4 Failed" + CEND)
    print(CRED + "Flow Menu not opened on button click" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 4 Passed" + CEND)
print("-----------------------")

'''
Test #5

Description: This test checks if adding tab groups works properly

'''
print(CYELLOW + "Running Test 5" + CEND)
# finding add group button and clicking it
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
# finding input and naming tab "Test Group"
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()
# searching for all tab groups
cards = driver.find_elements_by_class_name("card")
flag = 0
# looping through all tab groups
for i in cards:
    list_of_text = i.text
    if "Test Group" in i.text:
        flag = 1
        test_group = i
# searching for tab group title
h3_header = test_group.find_element_by_tag_name("h5")
try:
    assert h3_header.text == "Test Group"
except AssertionError:
    print(CRED + "Test 5 Failed" + CEND)
    print(CRED + "New tab group was not created" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 5 Passed" + CEND)
print("-----------------------")

'''
Test Number #6

Description: Testing tab group header is rendering correctly

'''
print(CYELLOW + "Running Test 6" + CEND)
page_header = driver.find_element_by_class_name("tabGroupsHeader")
page_title =  page_header.find_element_by_tag_name("h2")
try:
    assert "Tab Groups" in page_title.text
except AssertionError:
    print(CRED + "Test 6 Failed" + CEND)
    print(CRED + "Header text not rendering properly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 6 Passed" + CEND)
print("-----------------------")
assert all_tests_check == 0, CRED + "Some Tests Failed" + CEND
print(CGREEN + "All Tests Passed" + CEND)

# writing coverage details
coverage_json_file = open("./project/.nyc_output/#15.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()
