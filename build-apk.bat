@echo off
echo ===================================================
echo   SHILP-AI Android APK Builder (Capacitor)
echo ===================================================
echo.

echo Step 1: Building production web assets...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Syncing web assets to native Android project...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Capacitor sync failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 3: Compiling Android APK with Gradle...
cd android
if exist gradlew.bat (
    call gradlew.bat assembleDebug
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ===================================================
        echo [SUCCESS] APK Generated Successfully!
        echo Location: android\app\build\outputs\apk\debug\app-debug.apk
        echo ===================================================
    ) else (
        echo.
        echo [INFO] Could not run gradlew directly from command line (Java/Android SDK not found in PATH).
        echo You can open this project in Android Studio by running:
        echo    npx cap open android
        echo And then click: Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
    )
) else (
    echo [ERROR] gradlew.bat not found in android directory.
)

cd ..
pause
