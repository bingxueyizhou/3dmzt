@echo off
rem ##############################################
rem #  Description: 
rem #  return code: 3 - get program path failed
rem ##############################################

setlocal EnableDelayedExpansion

rem === set base path of files ===
call :getNodePath NODE_PATH
set LOG_PATH=!NODE_PATH!\log


echo !NODE_PATH!
echo !LOG_PATH!

rem node !NODE_PATH!\web.js >>!LOG_PATH!\web.log 2>>!LOG_PATH!\web.err


pause
goto end


rem ##########################   function Line   ##########################

rem ##############################################
rem #  Description: get program home path
rem #  Return: %1 - the path of node program
rem ##############################################
:getNodePath
    if "%1"=="" (
    	echo getNodePath can not return to a null value
        exit /b 3
    )
    set %~1=%~dp0..\..
goto :eof