from selenium import webdriver

options = webdriver.ChromeOptions()
options.add_extension('./Team-Potato-master.crx')

options.add_argument("--disable-dev-shm-usage") # overcome limited resource problems
options.add_argument("--no-sandbox") # Bypass OS security model
#options.add_argument("--headless")


driver = webdriver.Chrome('./test/chromedriver',options=options)


# This is only when using an unpacked version as UID key is not set until package is manually packed on the developer dashboard
driver.get("chrome://extensions")

uid = 'flfgpjanhbdjakbkafipakpfjcmochnp'
driver.get("chrome-extension://"+ uid +"/popup.html")


# Test 1: Find Element Hello World
hello_world = driver.find_element_by_id("greet")
assert hello_world.text == "Hello World!"


# Test 2: Checking if the input element is present
input_text = driver.find_element_by_id("name")
assert input_text.text is not None


# Test 3: Checking if the input element causes change in id="greet"
input_text.send_keys("Test 3")
test_3 = driver.find_element_by_id("greet")
assert test_3.text == "Hello Test 3"

print("All Tests Passed")



