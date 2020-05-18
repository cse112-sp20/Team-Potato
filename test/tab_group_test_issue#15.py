from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = webdriver.ChromeOptions()

<<<<<<< HEAD
#options.add_argument("load-extension=./build/")
options.add_extension('./build.crx')
=======
options.add_argument("load-extension=./build/")
#options.add_extension('./build.crx')
>>>>>>> 1a0ed6347278ffa68e24dd8683786d4bda336942
options.add_argument("--disable-dev-shm-usage") # overcome limited resource problems
options.add_argument("--no-sandbox") # Bypass OS security model

driver = webdriver.Chrome(options=options)

# This is only when using an unpacked version as UID key is not set until package is manually packed on the developer dashboard
driver.get("chrome://extensions")

<<<<<<< HEAD
uid = "flfgpjanhbdjakbkafipakpfjcmochnp"
=======
uid = "ccinfmkhbhbanafijpnhbcgmlnchgbhi"
>>>>>>> 1a0ed6347278ffa68e24dd8683786d4bda336942
driver.get("chrome-extension://"+ uid +"/popup.html")

# Test 1: Checking if open tab button exists
open_tab_buttons = driver.find_elements_by_tag_name("button")
for i in open_tab_buttons:
    if i.text != "Start":
        open_tab_button = i
assert open_tab_button.text == "Open Potato Tab", "Should be 'Open Potato Tab'"


# Test 2: Checking if open tab moves us to menu.html
open_tab_button.click()
driver.switch_to.window(driver.window_handles[-1])
post_press_title = driver.title
assert post_press_title == "Potato Tab Menu", "Should be 'Potato Tab Menu'"

# Test 3: Check if tab group button exists
add_group_button = driver.find_element_by_class_name("addGroup")
assert add_group_button is not None, "Add group button should exists"

# Test 4: Check if tab group button creates a new group
add_group_button.click()
cards = driver.find_elements_by_class_name("card")
flag = 0
for i in cards:
    list_of_text = i.text
    if "test" in i.text:
        flag = 1
        test_group = i

h3_header =  test_group.find_element_by_tag_name("h5")
assert h3_header.text == "test", "Group Button Does not work"

# Test 5: Check if hardcoded groups added to test group
listing_tabs = test_group.find_elements_by_class_name("tablink")
second_flag = 0
third_flag = 0
for i in listing_tabs:
    if i.text == "test1":
        second_flag = 1
    if i.text == "test2" and second_flag == 1:
        third_flag = 1
assert third_flag == 1, "Group Button doesnt add hard coded tabs"
print("Passed All Tests")