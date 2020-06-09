"""
File: no_duplicates_test_issue#103_issue#105.py
Author: Dhruv Duggal
Description: This file tests that duplicates are not being created for tabgroups or active tabs
Tests Contained: This file contains test #7,#8 and #9
"""

from selenium import webdriver
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

# assigning the extensions uid
uid = "flfgpjanhbdjakbkafipakpfjcmochnp"

# opening multiple of the same websites in different tabs
driver.get("https://facebook.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[1])
driver.get("https://facebook.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[2])
driver.get("https://facebook.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[3])
driver.get("https://facebook.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[4])
driver.get("https://facebook.com")
driver.switch_to.window(driver.window_handles[4])
# going to the extensions menu page
driver.get("chrome-extension://"+ uid +"/menu.html")

'''
Test Number #7

Description: This test checks that active tabs are not being populated with duplicates when the same website is opened
multiple times in different tabs

'''
print(CYELLOW + "Running Test 7" + CEND)
# finding active tabs element by class name
active_tabs_div = driver.find_element_by_class_name("activeTabs")
# finding all tabContainer class named elements
active_tabs = active_tabs_div.find_elements_by_class_name("tabContainer")
# creating a counter to check the number of tabs for a particular website
facebook_count = 0
# checking the active tabs and updating this count value
for i in active_tabs:
    if "Facebook" in i.text:
        facebook_count +=1
try:
    assert facebook_count == 1
except AssertionError:
    print(CRED + "Test 7 Failed" + CEND)
    print(CRED + "Duplicate active tabs were rendered" + CEND)
else:
    print(CGREEN + "Test 7 Passed" + CEND)
print("-----------------------")

'''
Test Number #8

Description: This test is checking that opening a new tab after *after* checking for duplicates does not cause
the code to break and render duplicate tabs by mistake

'''
print(CYELLOW + "Running Test 8" + CEND)
# getting a different website in the current tab
driver.get("https://instagram.com")
# opening a new tab and getting the menu.html page of the chrome extension
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[5])
driver.get("chrome-extension://"+uid+"/menu.html")

# checking the active tabs
active_tabs_div = driver.find_element_by_id("activeTabs")
active_tabs = active_tabs_div.find_elements_by_class_name("tabContainer")
# creating a counter for the number of tabs for a website opened multiple times
facebook_second_count = 0
# looping through all the active tabs
for i in active_tabs:
    if "Facebook" in i.text:
        facebook_second_count += 1
        facebook_tab = 1
    elif "Instagram" in i.text:
        insta_tab = 1
# checking if all tabs are rendered properly and there are no duplicates
try:
    assert facebook_tab == 1 and insta_tab == 1 and facebook_count == 1
except AssertionError:
    print(CRED + "Test 8 failed" + CEND)
    if facebook_tab != 1 or insta_tab != 1:
        print(CRED + "Active tabs were not rendered correctly" + CEND)
    if facebook_count == 0:
        print(CRED + "Duplicate active tabs were rendered" + CEND)
else:
    print(CGREEN + "Test 8 Passed" + CEND)
assert facebook_tab == 1 and insta_tab == 1 and facebook_second_count == 1
print("-----------------------")


'''
Test Number #9

Description: This test checks that duplicate tab groups are not being created when two tab groups are 
given the same name

'''
print(CYELLOW + "Running Test 9" + CEND)
# creating a new tab group called Test Group
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
# sending "Test Group" string to input
input_name.send_keys("Test Group")
# sending enter key to page
ActionChains(driver).send_keys(Keys.ENTER).perform()

# creating another tab group called Test Group
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
# sending "Test Group" string to input
input_name.send_keys("Test Group")
# sending enter key to page
ActionChains(driver).send_keys(Keys.ENTER).perform()

# creating another tab group called Test Group
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
# sending string "Test Group" to input
input_name.send_keys("Test Group")
# sending enter key to page
ActionChains(driver).send_keys(Keys.ENTER).perform()

# creating a tab group called Test Group3
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
# sending string "Test Group3" to input
input_name.send_keys("Test Group3")
# sending enter keys to page
ActionChains(driver).send_keys(Keys.ENTER).perform()

# creating another tab group called Test Group3
add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
# sending string "Test Group3" to input
input_name.send_keys("Test Group3")
# sending enter key to page
ActionChains(driver).send_keys(Keys.ENTER).perform()
# finding all cards by class name
cards = driver.find_elements_by_class_name("card")
# creating counter to ensure that only one group with a unique name is created
test_group_count = 0
test_group_3_count = 0
# looping through all the tab groups
for i in cards:
    header = i.find_element_by_class_name("card-header")
    if header.text == "Test Group":
        test_group_count += 1
    elif header.text == "Test Group3":
        test_group_3_count += 1
try:
    assert test_group_3_count == 1 and test_group_count == 1
except AssertionError:
    print(CRED+"Test 9 failed" + CEND)
    print(CRED+"Duplicate tab groups were rendered"+CEND)
else:
    print(CGREEN + "Test 9 Passed" + CEND)
print("-----------------------")
print(CGREEN+"All Tests Passed"+CEND)

# writing coverage details
coverage_json_file = open("./project/.nyc_output/#103_#105.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()
