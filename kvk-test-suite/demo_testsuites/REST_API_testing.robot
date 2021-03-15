*** Settings ***
Resource          ../keywords/all.robot

*** Settings ***
Test Teardown       run keyword if test failed       report last output message

*** Test Cases ***
# Requests are sent using the RESTinstance python library. This lib has a nice way of logging the entire output.
# The response is returned in JSON format. We can assert this response in 2 ways...
    # 1. Using the DictionaryHandler. 
    # 2. Using the keyword 'assert JSON' that uses JSONPath

# The keywod 'assert dictionary' takes the dictionary to be validated and a json string as input, the json string defines the node to be validated.
    # - The keyword searches for the first occurance of node specified and validates its value
    # - The json string can contain multiple nodes which are all validated
    # - by specifying nested objects the way of finding the node to be validated can be defined more precisely
    # - the keyword supports defining selectors by adding a * before the name of a node. This node is not validate itself, but is used to find a sibling that is validated
    #     for example: {"*OfferingType": 22, "Status": "Active"} means 'find the node Status with a sibling OfferingType which has the value 22 and validate the value of that Status node

Send POST request and assert dictionary
    # Create the body
    ${body}=            create dictionary   title=foo    body=bar
    # Sent the request & assert
    ${response}=        send POST request   https://jsonplaceholder.typicode.com/posts     ${body}
    assert dictionary   ${response}         {"title":"foo"}

# It is also possible to get values from the response with the dictionaryhandler
Get value from response with dictionaryhandler
    ${response}=        send GET request         http://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam
    ${actual_value}=    get value from dictionary       ${response}     plaats
    should be equal     ${actual_value}         Amsterdam     

# Another method is to validate the response using the keyword 'assert JSON' that is using JSONPath to find the element
Send GET request and assert with JSONPath
    ${response}=        send GET request    http://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam
    assert JSON         ${response}         $.liveweer..plaats     Amsterdam        string

Send GET request and get value from JSON response
    ${response}=        send GET request    http://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam
    ${actual_value}=    get from JSON       ${response}         $.liveweer..plaats
    should be equal     ${actual_value}     Amsterdam