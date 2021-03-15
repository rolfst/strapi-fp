*** Settings ***
# Out of the box libraries
Library         DateTime
Library         String
Library         Collections
Library         OperatingSystem

# External libraries
Library          SeleniumLibrary    timeout=15  run_on_failure=${NONE}      # No screenshot, created own keyword: report screenshot
Library          REST

# Keywords
Resource        generic_gui_keywords.robot
Resource        generic_rest_keywords.robot

# Helpers/Handlers
Library         ../helpers/BrowserHelper.py
Library         ../helpers/RestHandler.py