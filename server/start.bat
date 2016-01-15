:start
@echo off
setlocal
cd /d %~dp0
title Paypoint Server
node paypoint.js
pause
cls
goto start