@echo off
echo ===============================================
echo       SciEquip GitHub Push Helper
echo ===============================================
echo.
echo This script will help you push your code to GitHub.
echo.

set /p repo_url="Enter your GitHub Repository URL (e.g., https://github.com/username/repo.git): "

if "%repo_url%"=="" (
    echo Error: No URL entered. Exiting.
    pause
    exit /b
)

echo.
echo Setting remote 'origin' to %repo_url%...
git remote add origin %repo_url% 2>nul
if %errorlevel% neq 0 (
    echo Remote 'origin' might already exist. Updating it...
    git remote set-url origin %repo_url%
)

echo.
echo Pushing to main branch (Force Push)...
git branch -M main
git push -u origin main --force

echo.
echo ===============================================
if %errorlevel% equ 0 (
    echo       SUCCESS! Code pushed to GitHub.
) else (
    echo       ERROR: Push failed. Check your URL and permissions.
)
echo ===============================================
pause
