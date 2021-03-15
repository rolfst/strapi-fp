*** Keywords ***
Send GET request
    [Arguments]     ${url}
    [Documentation]  Sends a GET request and asserts the statuscode for status 200. Returns the response in JSON.
    REST.GET        ${url}
    ${output}=      output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}   ${output}
    assert dictionary   ${output}  {"status":200}   
    ${response}=    output      response body
    [Return]        ${response}

Send POST request
    [Arguments]      ${url}      ${body}
    [Documentation]  Sends a POST request and asserts the statuscode for status 201. Returns the response in JSON.
    REST.POST        ${url}      ${body}
    ${output}=       output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}    ${output}
    assert dictionary   ${output}      {"status":201}
    ${response}=     output      response body      
    [Return]         ${response}

Send DELETE request
    [Arguments]      ${url}      
    [Documentation]  Sends a DELETE request and asserts the statuscode for status 200. Returns the response in JSON.
    REST.DELETE      ${url}      
    ${output}=       output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}   ${output}
    assert dictionary    ${output}      {"status":200}
    ${response}=     output      response body      
    [Return]         ${response}