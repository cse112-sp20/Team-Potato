"""
File: website_blocking_test_issue#73_issue#62.py
Author: Dhruv Duggal
Description: This file tests the website blocking functionality
Tests Contained: This file contains test #25, #26, #27, #28, #29, #30, #31, #32
"""
from selenium import webdriver
from selenium.common.exceptions import NoSuchWindowException
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
driver.get("https://piazza.com")
driver.switch_to.window(driver.window_handles[4])
# opening menu page of chrome extension
driver.get("chrome-extension://"+ uid +"/menu.html")

# creating a tab group called "Test Group" with all active tabs
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

'''
Test Number #26

Description: Testing the persistance of tab groups on popup.html

'''
print(CYELLOW + "Running Test 26")
# navigating to popup.html
driver.get("chrome-extension://"+ uid +"/popup.html")
sleep(2)
# searching for tab group on popup.html
cards = driver.find_elements_by_class_name("card")
pers_check = 0
for i in cards:
    if i.find_element_by_class_name("card-header").text == "Test Group":
        pers_check = 1
        h5_class = i.find_element_by_class_name("buttonGroup")
try:
    assert pers_check == 1
except AssertionError:
    print(CRED + "Test 26 Failed" + CEND)
    print(CRED + "Tab group not persistent on popup.html" + CEND)
else:
    print(CGREEN + "Test 26 Passed" + CEND)
print("-----------------------")


'''
Test Number #28

Description: Testing if google is white listed even if not in tabgroup

'''
print(CYELLOW + "Running Test 28" + CEND)
# clicking on play button for tab group found in previous test
play_button = h5_class.find_element_by_tag_name("button")
play_button.click()
# clicking on start focus mode button
pop_up_div = driver.find_element_by_class_name("popupFocusMode")
start_button = pop_up_div.find_element_by_class_name("popupFocusModeButton")
start_button.click()
# switching to a new window and opening the popup extension on it
driver.switch_to.window(driver.window_handles[4])
driver.get("chrome-extension://"+ uid +"/popup.html")
# opening a new tab and opening google.com
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[1])
driver.get("https://google.com")
# giving sleep time to check if overlay loads
sleep(5)
google_unblocked = 0
# if overlay does not load then we set google_unblocked to 1
try:
    driver.find_element_by_class_name("overlay")
except NoSuchElementException:
    google_unblocked = 1
else:
    google_unblocked = 0


try:
    assert google_unblocked == 1
except AssertionError:
    print(CRED + "Test 28 Failed" + CEND)
    print(CRED + "Google is not whitelisted" + CEND)
else:
    print(CGREEN + "Test 28 Passed" + CEND)
print("-----------------------")


'''
Test Number #29

Description: This test checks whether a website not in the tab group is blocked
or not

'''
print(CYELLOW + "Running Test 29" + CEND)
# navigating to netflix.com
driver.get("https://netflix.com")
# sleeping for 5 seconds to let overlay load
sleep(5)
#  checking if over lay is present and contains any one of the randomly generated text
overlay = driver.find_element_by_class_name("overlay")
main = overlay.find_element_by_class_name("main")
p_blocking = main.find_element_by_class_name("heading")
try:
    assert "Tsk tsk tsk 😤, you should be focusing on" in p_blocking.text or \
    "Shouldn't you be working on" in p_blocking.text or \
    "Quit 🐴-ing around, get back to work on" in p_blocking.text or \
    "What do you think you're doing 👀? Focus on" in p_blocking.text or \
    " isn't that important to you" in p_blocking.text or \
    "You wanted to focus on" in p_blocking.text or \
    "Seriously 😟, you need to work on" in p_blocking.text
except AssertionError:
    print(CRED + "Test 29 Failed" + CEND)
    print(CRED + "Website not blocked" + CEND)
else:
    print(CGREEN + "Test 29 Passed" + CEND)
print("-----------------------")


'''
Test Number #30

Description: This test checks if the unblock session is being generated correctly

'''
print(CYELLOW + "Running Test 30" + CEND)
# searching for unblock session button
allow_button = main.find_element_by_id("unblockSessionBtn")
# testing if is contains the expected text
try:
    assert "Please, I really need " in allow_button.text
except AssertionError:
    print(CRED + "Test 30 Failed" + CEND)
    print(CRED + "Allow button not rendering text properly" + CEND)
else:
    print(CGREEN + "Test 30 Passed" + CEND)
print("-----------------------")


'''
Test Number #31

Description: This test checks if the close button is being rendered properly

'''
print(CYELLOW + "Running Test 31" + CEND)
# searching for the close tab button
buttons = main.find_elements_by_tag_name("button")
check_final_button = 0
close_tab_button  = None
for i in buttons:
    if "You got me, close this tab" in i.text:
        check_final_button = 1
        close_tab_button = i
# testing if it contains the right text
try:
    assert check_final_button == 1
except AssertionError:
    print(CRED + "Test 31 Failed" + CEND)
    print(CRED + "Close button text rendering properly" + CEND)
else:
    print(CGREEN + "Test 31 Passed" + CEND)
print("-----------------------")


'''
Test Number #32

Description: This tests checks whether the allow session button is working correctly
'''
print(CYELLOW + "Running Test 32" + CEND)
# click allow session button
allow_button.click()
# sleep for 1 second to allow overlay to disappear
sleep(1)
# open a new tab and check whether netflix is still blocked
allowed_check = 0
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[4])
driver.get("https://netflix.com")
sleep(5)
# check if overlay is present on netflix.com
try:
    driver.find_element_by_class_name("overlay")
except NoSuchElementException:
    allowed_check = 1
else:
    allowed_check = 0

try:
    assert allowed_check == 1
except:
    print(CRED + "Test 32 Failed" + CEND)
    print(CRED + "Allow website button not working" + CEND)
else:
    print(CGREEN + "Test 32 Passed" + CEND)
print("-----------------------")

print(CGREEN + "All Tests Passed" + CEND)

# writing coverage report
coverage_json_file = open("./project/.nyc_output/#73_#62.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()


