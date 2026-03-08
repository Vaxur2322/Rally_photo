@echo off
REM Démarre le serveur Node.js et ouvre les pages dans le navigateur
start "Node Server" cmd /k "cd /d %~dp0 && npm start"
start "Page principale" http://localhost:3000/
start "Admin" http://localhost:3000/panel
start "Slideshow" http://localhost:3000/slideshow
