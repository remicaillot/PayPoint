setlocal
cd /d %~dp0
start server\start.bat
start nw\win\nw.exe "./app"