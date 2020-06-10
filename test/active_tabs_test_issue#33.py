"""
File: active_tabs_test_issue#33.py
Author: Dhruv Duggal
Description: This file tests rendering of active tabs on menu.html and checks if active tabs are updated whenever
we open a new tab
Test Contained: This files contains tests #1 and #2
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import json
import os
from time import sleep

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
options.add_arguments("--headless")
print("set up driver")
# creating chrome driver
driver = webdriver.Chrome(options=options)

# assigning the extensions uid
uid = "flfgpjanhbdjakbkafipakpfjcmochnp"
# opening multiple tabs and loading different sites on them
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
# going to the extensions menu page
driver.get("chrome-extension://" + uid + "/menu.html")

'''
Test Number #1

Description: This test checks if all active tabs are rendered properly when they are opened *before* menu.js is opened

'''
print(CYELLOW + "Running Test 1" + CEND)
# finding active tabs element by class name
active_tabs = driver.find_element_by_class_name("activeTabs")
# finding all tabContainer class named elements
list_of_active_tabs = active_tabs.find_elements_by_class_name("tabContainer")
# creating booleans to check if each of the tabs are being rendered properly
check_tab_1 = 0
check_tab_2 = 0
check_tab_3 = 0
check_tab_4 = 0
check_tab_5 = 0
# boolean check to summarize the above checks
final_check_tab = 0
# checking if the tabs are showing up as active tabs
for i in list_of_active_tabs:
    if "Computer Science" in i.text:
        check_tab_1 = 1
    if "Facebook" in i.text:
        check_tab_2 = 1
    if "Twitter" in i.text:
        check_tab_3 = 1
    if "Stack Overflow" in i.text:
        check_tab_4 = 1
    if check_tab_1 == 1 and check_tab_2 == 1 and check_tab_3 == 1 and check_tab_4 == 1:
        final_check_tab = 1
# assertion for test 1
try:
    assert final_check_tab == 1
except AssertionError:
    print(CRED + "Test 1 Failed" + CEND)
    print(CRED + "Active tabs were not rendered correctly" + CEND)
    all_tests_check = 1

else:
    print(CGREEN + "Test 1 Passed" + CEND)

print("-----------------------")

'''
Test Number #2

Description: This test checks if all active tabs are rendered properly when they are opened *after* menu.js is opened

'''
# opening a new tab and loading a different website
print(CYELLOW + "Running Test 2" + CEND)
driver.switch_to.window(driver.window_handles[1])
driver.get("https://gradescope.com")
# going back to menu page
driver.switch_to.window(driver.window_handles[5])
driver.refresh()
# checking if the new tab is present in the active page with reload
active_tabs = driver.find_element_by_class_name("activeTabs")
list_of_active_tabs = active_tabs.find_elements_by_class_name("tabContainer")
active_reload_check = 0
for i in list_of_active_tabs:
    if "Gradescope" in i.text:
        active_reload_check = 1
try:
    assert active_reload_check == 1
except AssertionError:
    print(CRED + "Test 2 Failed" + CEND)
    print(CRED + "Active tabs were not updated correctly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 2 Passed" + CEND)

print("-----------------------")
assert all_tests_check == 0, CRED + "Some Tests Failed" + CEND
print(CGREEN + "All Tests Passed" + CEND)

# writing coverage details
coverage_json_file = open("./project/.nyc_output/#33.json", "w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()
