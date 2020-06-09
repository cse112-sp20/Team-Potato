"""
File: focus_mode_timer_test_issue#36_issue#30.py
Author: Dhruv Duggal
Description: This file tests the functionality for the timer on popup.html
Tests Contained: This file contains test #17, #18, #19, #20, #21, #22, #23, #24, and #25
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
driver.get("https://piazza.com")
driver.switch_to.window(driver.window_handles[4])
# opening menu page of chrome extension
driver.get("chrome-extension://"+ uid +"/menu.html")

# creating a new Tab Group called CSE12
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

'''
Test Number #17

Description: This test checks that the tab group is properly displaying on the popup page 
of the extension
'''
print(CYELLOW + "Running Test 17" + CEND)
# going to popup page
driver.get("chrome-extension://" + uid + "/popup.html")

# searching for tabgroup named CSE 112
menuContainer = driver.find_element_by_class_name("popupContainer")
cards = driver.find_elements_by_class_name("card")
target_group = None
found_on_popup = 0
for i in cards:
    if i.find_element_by_class_name("card-header").text == "CSE112":
        target_group = i
        found_on_popup = 1
try:
    assert found_on_popup == 1
except AssertionError:
    print(CRED + "Test 17 Failed" + CEND)
    print(CRED + "Tab group is not rendering on popup page" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 17 PASSED" + CEND)
print("-----------------------")


'''
Test Number #18

Description: This test checks that clicking the play button renders the correct elements
the popup page of the extension

'''
print(CYELLOW + "Running Test 18" + CEND)
# finding and clicking on the play_button for the correct tab group
play_button_group = target_group.find_element_by_class_name("buttonGroup")
play_button = play_button_group.find_element_by_tag_name("button")
play_button.click()
# Checking if all the text elements are rendered
first_check_el = driver.find_element_by_class_name("popupFocusMode")
title_timer = driver.find_element_by_class_name("popupFocusModeTitle")
name_timer = driver.find_element_by_class_name("popupFocusModeTabGroupName")
first_check = 0
second_check = 0
third_check = 0
final_check = 0
if title_timer.text == "Focus Mode":
    first_check = 1
if name_timer.text == "CSE112":
    second_check = 1
try:
    assert second_check == 1 and first_check == 1
except AssertionError:
    print(CRED + "Test 18 Failed" + CEND)
    if first_check == 1:
        print(CRED + "Focus mode title did not render properly" + CEND)
    if second_check == 1:
        print(CRED + "Tab groups title did not render properly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 18 Passed" + CEND)
print("-----------------------")


'''
Test Number #19

Description: This button checks that the start button is being rendered properly

'''
print(CYELLOW + "Running Test 19" + CEND)
# finding button and checking if it is a start button
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
button_timer_start = pop_up_div.find_element_by_class_name("popupFocusModeButton")
original_display = pop_up_div.text
try:
    assert button_timer_start.text == "Start Focus"
except AssertionError:
    print(CRED + "Test 19 Failed" + CEND)
    print(CRED + "Start button not rendered properly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 19 Passed" + CEND)
print("-----------------------")


'''
Test Number #20

Description: Checking if button changes to End when it is initially clicked

'''
print(CYELLOW + "Running Test 20" + CEND)
# clicking the start button found in previous test
button_timer_start.click()
# opening popup.html again after focus mode has begun
driver.switch_to.window(driver.window_handles[4])
driver.get("chrome-extension://"+ uid +"/popup.html")
# searching for the end button
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
end_focus = pop_up_div.find_element_by_class_name("popupFocusModeButton")
try:
    assert end_focus.text == "End Focus"
except AssertionError:
    print(CRED + "Test 20 Failed" + CEND)
    print(CRED + "Button did not change to 'End' upon starting focus mode" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 20 Passed" + CEND)
print("-----------------------")

'''
Test Number #21

Description: Checking if end button takes us back to the original view of popup.html

'''
print(CYELLOW + "Running Test 21" + CEND)
# click end focus button found in previous test
end_focus.click()
# Checking if tabs are still present after clicking end focus
menuContainer = driver.find_element_by_class_name("popupContainer")
cards = driver.find_elements_by_class_name("card")
final_check = 0
for i in cards:
    if i.find_element_by_class_name("card-header").text == "CSE112":
        final_check = 1
try:
    assert final_check == 1
except AssertionError:
    print(CRED + "Test 21 Failed" + CEND)
    print(CRED + "Enc focus does not make popup.html go to its original state"+CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 21 Passed" + CEND)
print("-----------------------")


'''
Test Number #22

Description: This test checks whether the slider to change the time of focus mode is working

'''
print(CYELLOW + "Running Test 22" + CEND)
# go to popup.html
driver.get("chrome-extension://" + uid + "/popup.html")
# search for tab group cse112
cards = driver.find_elements_by_class_name("card")
for i in cards:
    if i.find_element_by_class_name("card-header").text == "CSE112":
        target_group = i
# click play button for this group
play_button_group = target_group.find_element_by_class_name("buttonGroup")
play_button = play_button_group.find_element_by_tag_name("button")
play_button.click()
# move slider and check if time has changed
slider_thumb = driver.find_element_by_class_name("sliderThumb")
ActionChains(driver).click_and_hold(slider_thumb).move_by_offset(10,0).release().perform()
try:
    assert "1:10:00" in driver.find_element_by_class_name("popupFocusModeTimer").text
except AssertionError:
    print(CRED + "Test 22 Failed" + CEND)
    print(CRED + "Timer not changing properly with slider" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 22 Passed" + CEND)
print("-----------------------")


'''
Test Number #23

Description: This test checks the max time possible for the timer

'''
print(CYELLOW + "Running Test 23")
# move the slider to the max
slider_thumb = driver.find_element_by_class_name("sliderThumb")
ActionChains(driver).click_and_hold(slider_thumb).move_by_offset(200,0).release().perform()
try:
    assert "3:00:00" in driver.find_element_by_class_name("popupFocusModeTimer").text
except AssertionError:
    print(CRED + "Test 23 Failed" + CEND)
    print(CRED + "Max time not correct" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 23 Passed" + CEND)
print("-----------------------")


'''
Test Number #24

Description: This test checks the min time possible for the timer

'''
print(CYELLOW + "Running Test 24" + CEND)
# move the slider all the way to the bottom
slider_thumb = driver.find_element_by_class_name("sliderThumb")
ActionChains(driver).click_and_hold(slider_thumb).move_by_offset(-200,0).release().perform()
try:
    assert "0:05:00" in driver.find_element_by_class_name("popupFocusModeTimer").text
except AssertionError:
    print(CRED + "Test 24 Failed" + CEND)
    print(CRED +"Min time not correct" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 24 Passed" + CEND)
print("-----------------------")


'''
Test Number #25

Description: Checking persistence of timer and whether it is counting down properly or not

'''
print(CYELLOW + "Running Test 25" + CEND)
# clicking start button
start_button = driver.find_element_by_class_name("popupFocusModeButton")
start_button.click()
# re-opening the popup extension (this takes 1-10 seconds)
driver.switch_to.window(driver.window_handles[4])
driver.get("chrome-extension://" + uid + "/popup.html")
sleep(5)
# checking if time elapsed on the timer is between 6-16 seconds
final_time = driver.find_element_by_class_name("popupFocusModeTimer").text
try:
    assert "0:04:50" in final_time or "0:04:51" in final_time or "0:04:49" in final_time or "0:04:48" in final_time or \
           "0:04:46" in final_time or "0:04:47" in final_time or "0:04:52" in final_time or "0:04:53" in final_time
except AssertionError:
    print(CRED + "Test 25 Failed" + CEND)
    print(CRED + "Timer counting down properly" + CEND)
    all_tests_check = 1
else:
    print(CGREEN + "Test 25 Passed" + CEND)
print("-----------------------")
assert all_tests_check == 0, CRED + "Some Tests Failed" + CEND
print(CGREEN + "All Tests Passed" + CEND)
# writing coverage report
coverage_json_file = open("./project/.nyc_output/#30_#36.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()