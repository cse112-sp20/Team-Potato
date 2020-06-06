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
input_name.send_keys("Test Group")
ActionChains(driver).send_keys(Keys.ENTER).perform()
new_count = len(driver.find_elements_by_class_name("card"))
assert new_count-old_count == 1, "new tabgroup not added"


cards = driver.find_elements_by_class_name("card")
name_check = 0
div_to_search = None
header_to_search = None
for c in cards:
    if c.find_element_by_tag_name("h5").text == "Test Group":
        header_to_search = c.find_element_by_tag_name("h5")
        div_to_search = c
        name_check = 1
assert name_check == 1, "Group named 'Test Group' not found"

check_tab_1 = 0
check_tab_2 = 0
check_tab_3 = 0
check_tab_4 = 0
check_tab_5 = 0

grouping = div_to_search.find_element_by_class_name("card-body")
for g in grouping.find_elements_by_class_name("tabContainer"):
    if "Computer Science" in g.text:
        check_tab_1 = 1
    elif "Twitter" in g.text:
        check_tab_2 = 1
    elif "Facebook" in g.text:
        check_tab_3 = 1
    elif "Stack Overflow" in g.text:
        check_tab_4 = 1
assert check_tab_4 == 1 and check_tab_1 == 1 and check_tab_3 == 1 and check_tab_4 == 1,\
    "Tabs not present in tabgroup"

# checking if edit and delete buttons available
buttons_to_check =header_to_search.find_elements_by_tag_name("button")
assert len(buttons_to_check) == 2, "Either delete or edit button not rendering"

#checking if edit button works
edit_button = buttons_to_check[1]
edit_button.click()

edit_input = header_to_search.find_element_by_tag_name("input")
edit_input.clear()
edit_input.send_keys("New Name")
edit_input.send_keys(Keys.ENTER)


cards = driver.find_elements_by_class_name("card")
name_check_edit= 0
div_to_search_edit = None
new_header_to_search = None
cards = driver.find_elements_by_class_name("card")
for c in cards:
    if c.find_element_by_tag_name("h5").text == "New Name":
        name_check_edit = 1
        new_header_to_search = c.find_element_by_tag_name("h5")
assert name_check_edit == 1, "Edit Name Failed"

#checking if enter edit bug fixed
buttons_to_check_2 = new_header_to_search.find_elements_by_tag_name("button")
edit_button = buttons_to_check_2[1]
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
assert name_check_edit_2 == 1, "Edit enter bug"


#checking delete functionality
buttons_to_check = final_header_to_search.find_elements_by_tag_name("button")
delete_button = buttons_to_check[0]
delete_button.click()
tab_groups = driver.find_element_by_class_name("tabGroups")
cards_final_check = tab_groups.find_elements_by_class_name("card")
assert len(cards_final_check) == 0, "Delete Button Not Working"
print("All Tests Passed")
coverage_json_file = open("./project/.nyc_output/#34.json","w+")
json.dump(driver.execute_script("return window.__coverage__;"), coverage_json_file)
coverage_json_file.close()
