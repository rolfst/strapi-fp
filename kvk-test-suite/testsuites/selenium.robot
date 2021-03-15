*** Settings ***
Resource          ../keywords/all.robot
Resource          ../config/${ENVIRONMENT}_environment.robot
Resource          ../config/mobile_devices/${CONFIG_MOBILE_DEVICE}.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the url.
${ENVIRONMENT}                  test
# Choose between Desktop and Mobile. If the device == Desktop the value in 'config_mobile_device' is ignored.
${DEVICE}                       Desktop                      
# The value in 'mobile_device_settings' is used to load a config file in ../config/mobile_devices. See the settings section on top of this file.
# The variables in the config file are then used to setup a browser on the specified mobile device.
${CONFIG_MOBILE_DEVICE}         ios_iphone_11ProMax_emulator
# To run tests with different browser. Pass in another variable here, or through CLI: -v browser:Firefox
${BROWSER}                      chrome                      

*** Settings ***
# The test execution is started with trying to reuse a previous webdriver instance
# When no browser is found a new instance is created and navigating to the url provided by the 'url' argument
Test Setup         setup browser    browser=${BROWSER}   device=${DEVICE}   url=${GUI_URL}
# When a test has failed, an additional screenshot is added to the report (because RF does not execute the 'on error' when a validation fails)
Test Teardown      run keyword if test failed       report screenshot

*** Test Cases ***
tweakers selenium test
    [Teardown]
    go to               https://tweakers.net/
