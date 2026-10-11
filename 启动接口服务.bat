@echo off
chcp 936 >nul
title 牛只管理接口服务
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto NONODE

netstat -ano | findstr /c:":8124" | findstr /i "LISTENING" >nul 2>nul
if not errorlevel 1 goto ALREADY

echo 正在启动接口服务，请稍候...
start "接口服务" /min node "%~dp0接口服务\api-server.js"
timeout /t 3 /nobreak >nul
goto OPEN

:ALREADY
echo 接口服务已经在运行了。

:OPEN
start "" "%~dp0接口文档.html"
echo.
echo   接口地址: http://127.0.0.1:8124
echo   接口文档已打开，照着它写测试用例。
echo.
echo   提示: 那个最小化的「接口服务」窗口不要关闭，关掉服务就停了。
echo   想停止服务，双击运行 停止接口服务.bat
echo.
timeout /t 10 /nobreak >nul
exit /b 0

:NONODE
echo.
echo   未找到 node 命令，请先安装 Node.js 后再运行本文件。
echo.
pause
exit /b 1
