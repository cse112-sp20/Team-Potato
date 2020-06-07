from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import json

chrome_options = Options()

chrome_options.add_argument("load-extension=C:/Users/Computing centre/PycharmProjects/extension_testing/Team-Potato/build")

driver = webdriver.Chrome("./chromedriver", options=chrome_options)

# This is only when using an unpacked version as UID key is not set until package is manually packed on the developer dashboard

uid = "flfgpjanhbdjakbkafipakpfjcmochnp"
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
driver.get("chrome-extension://"+ uid +"/menu.html")
active_tabs_div = driver.find_element_by_class_name("activeTabs")
active_tabs = active_tabs_div.find_elements_by_class_name("tabContainer")
facebook_count = 0
for i in active_tabs:
    if "Facebook" in i.text:
        facebook_count +=1
assert facebook_count == 1, "Assert Duplicate Tabs showing up"

driver.get("https://instagram.com")
driver.execute_script("window.open('');")
driver.switch_to.window(driver.window_handles[5])
driver.get("chrome-extension://"+uid+"/menu.html")
check_tabs_final = 0
active_tabs_div =  driver.find_element_by_id("activeTabs")
active_tabs = active_tabs_div.find_elements_by_class_name("tabContainer")
facebook_second_count = 0
for i in active_tabs:
    if "Facebook" in i.text:
        facebook_second_count += 1
        facebook_tab = 1
    elif "Instagram" in i.text:
        insta_tab = 1
assert facebook_tab == 1 and insta_tab == 1 and facebook_second_count == 1

add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()

add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()

add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()

add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group3")
ActionChains(driver).send_keys(Keys.ENTER).perform()

add_group_button = driver.find_element_by_class_name("addGroup")
add_group_button.click()
model_body = driver.find_element_by_class_name("modal-body")
input_name = model_body.find_element_by_id("groupName")
input_name.send_keys("Test Group3")
ActionChains(driver).send_keys(Keys.ENTER).perform()
cards = driver.find_elements_by_class_name("card")
test_group_count = 0
test_group_3_count = 0
for i in cards:
    header = i.find_element_by_class_name("card-header")
    if header.text == "Test Group":
        test_group_count += 1
    elif header.text == "Test Group3":
        test_group_3_count += 1
assert test_group_3_count == 1 and test_group_count == 1, "Duplicate Tab Groups Being Created"
print("All Tests Passed")
coverage_json_file = open("./project/.nyc_output/#103_#105.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
driver.quit()
