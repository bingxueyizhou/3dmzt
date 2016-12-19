#!/bin/bash
##############################################
#  Description: 
#  return code: 3 - get program path failed
##############################################


##############################################
#  Description: get program home path,need call with $()
#  Return: the path of node program
##############################################
function getNodePath(){
	TMP_PATH=`pwd`
	cd "$TMP_PATH../.." >/dev/null 2>/dev/null
    echo $(pwd)
    cd $TMP_PATH >/dev/null 2>/dev/null
}


##########################   Logic Line   ##########################

# === set base path of files ===
NODE_PATH=$(getNodePath)
LOG_PATH="$NODE_PATH/log"


echo $NODE_PATH
echo $LOG_PATH

# nohup sudo node web.js >./log/log &i


read -n 1
exit 0


