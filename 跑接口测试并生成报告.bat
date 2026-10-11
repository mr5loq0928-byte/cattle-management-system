@echo off
chcp 936 >nul
title Newman 跑接口测试并生成报告
cd /d "%~dp0"

netstat -ano | findstr /c:":8124" | findstr /i "LISTENING" >nul 2>nul
if errorlevel 1 (
  echo.
  echo   接口服务没有运行。请先双击「启动接口服务.bat」，再运行本文件。
  echo.
  pause
  exit /b 1
)

echo.
echo   正在跑接口测试，请稍候...
echo.
newman run "%~dp0接口测试练习_带断言.postman_collection.json" -r cli,htmlextra --reporter-htmlextra-export "%~dp0Newman练习\Newman测试报告.html" --reporter-htmlextra-title "牛只管理接口 - 自动化测试报告"
echo.
echo   跑完了。
echo   文字结果: Newman练习\Newman运行结果.txt
echo   网页报告: Newman练习\Newman测试报告.html
echo.
echo   表格里 assertions 那一行的右边数字，就是"失败了几条断言"。
echo.
pause