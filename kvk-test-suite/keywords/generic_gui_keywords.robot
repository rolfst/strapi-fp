*** Keywords ***
Login   
    [Tags]      WIP
    [Arguments]         ${environment}          #${username}=None     ${password}=None
    # TODO check if already logged in (to correct environment)
    ${environment}=     convert to lowercase        ${environment}
    go to               ${environment_${environment}_URL}
    # ${username}=        run keyword if      '${username}' != 'None'  _get username    ${username}
    # ...  ELSE           set variable        ${username}
    # ${password}=        run keyword if      '${username}' != 'None'  _get password    ${password}
    # ...  ELSE           set variable        ${password}

_get username
    [Tags]      WIP
    [Arguments]                 ${username}=None
    return from keyword if      '${username}'!='None'       ${username}
    return from keyword         

_get password
    [Tags]      WIP
    [Arguments]                 ${password}=None
    return from keyword if      '${password}'!='None'       ${password}

Create Android Chrome webdriver
    [Documentation]     This keyword creates a Chrome webdriver instance on an Android device.
    [Arguments]         ${url}
        ${chromeOptions}          Create Dictionary    androidPackage=com.android.chrome
    ${desired_capabilities}   Create Dictionary    chromeOptions=${chromeOptions}
    ...                                            platformName=${platformName}
    ...                                            platformVersion=${platformVersion}
    ...                                            deviceName=${deviceName}
    ...                                            browserName=Chrome          
    create webdriver         Remote    command_executor=http://localhost:4723/wd/hub    desired_capabilities=${desired_capabilities}
    go to   ${url}

Create remote webdriver
    [Arguments]              ${desired_capabilities}     ${url}     ${command_executor}=http://localhost:4723/wd/hub
    create webdriver         Remote    command_executor=${command_executor}    desired_capabilities=${desired_capabilities}
    go to                    ${url}
