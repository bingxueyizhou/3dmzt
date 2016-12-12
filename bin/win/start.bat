@echo off
call :getNodePath
set NODE_PATH=../../
set LOG_PATH=../../

rem node /home/ubuntu/node/proc.js >> /home/ubuntu/node/log/proc_log


pause
goto end


rem ##########################   function Line   ##########################

rem ##############################################
rem #  Description: get program home path
rem #  Param: 
rem ##############################################
:getNodePath
echo hello
goto :eof