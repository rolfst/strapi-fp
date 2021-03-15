*** Keywords ***
# Below 2 GET and POST keywords are build for the RobotFramework-Requests library.
# Decided not to use this library because the logging of the requests and responses is cumbersome and less detailed
# than the REST library.
Send GET request
    [Arguments]         ${session}      ${endpoint}     ${log_to_console}=False
    [Documentation]     Sends a GET request and asserts the statuscode for status 200. Returns the response in JSON.
    ${response}=        GET request         ${session}        ${endpoint}
    should be equal     '${response.status_code}'     '200'
    ...                 Response Status Code assertion failed. Expected: '200'. Actual: '${response.status_code}'.
    ${response_log}=    to JSON             ${response.content}      	pretty_print=True
    log                 ${response_log}
    run keyword if      '${log_to_console}' == 'True'        log to console      ${response_log}
    [Return]            ${response.json()}

Send POST request
    [Arguments]         ${session}      ${endpoint}     ${body}      ${log_to_console}=False
    [Documentation]     Sends a POST request and asserts the statuscode for status 201. Returns the response in JSON.
    ${body_log}=        convert to string   ${body}
    ${body_log} =	    Replace String	    ${body_log}     '       "
    ${body_log}=        to JSON             ${body_log}      	pretty_print=True
    log                 ${body_log}
    ${response}=        POST request       ${session}        ${endpoint}      body=${body}
    should be equal     '${response.status_code}'     '201'
    ...                 Response Status Code assertion failed. Expected: '201'. Actual: '${response.status_code}'.
    ${response_log}=    to JSON             ${response.content}      	pretty_print=True
    log                 ${response_log}
    run keyword if      '${log_to_console}' == 'True'        log to console      ${response_log}
    [Return]            ${response.json()}