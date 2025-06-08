@echo off
setlocal enabledelayedexpansion

REM Try to find and set EMSDK if not already set
if not defined EMSDK (
    echo EMSDK not set, attempting to find it...
    
    REM Debug output for troubleshooting
    echo Current user profile location:
    echo %USERPROFILE%
    
    REM Try multiple possible environment variables
    if "%USERPROFILE%"=="" (
        set "USER_DIR=%HOMEDRIVE%%HOMEPATH%"
    ) else (
        set "USER_DIR=%USERPROFILE%"
    )
    
    echo Checking for emsdk in: %USER_DIR%
    
    if exist "%USER_DIR%\emsdk" (
        set "EMSDK=%USER_DIR%\emsdk"
        echo Found EMSDK at: %EMSDK%
        call "%EMSDK%\emsdk_env.bat"
    ) else (
        echo Error: Could not find emsdk folder
        echo Searched in:
        echo - %USER_DIR%\emsdk
        echo Please install in this location or set EMSDK manually
        exit /b 1
    )
)

REM Ensure we're in the right directory
cd /d "%~dp0"

REM Add MinGW64 to PATH if not already there
set "PATH=C:\msys64\mingw64\bin;C:\msys64\usr\bin;%PATH%"

REM Create build directory if it doesn't exist
if not exist build mkdir build
cd build

REM Configure with Emscripten using MinGW Makefiles
call emcmake cmake .. -G "MinGW Makefiles"

REM Build with MinGW make
call emmake mingw32-make

REM Copy the built files to public directory
echo Copying WebAssembly files to public directory...
if not exist ..\..\public mkdir ..\..\public
copy /Y CppWasm.* ..\..\public\

REM Copy the Emscripten JavaScript support file if needed
if exist "%EMSDK%\upstream\emscripten\cache\sysroot\lib\wasm32-emscripten\lib.js" (
    echo Copying Emscripten support files...
    copy /Y "%EMSDK%\upstream\emscripten\cache\sysroot\lib\wasm32-emscripten\lib.js" ..\..\public\
)

echo Build complete! Files copied to public directory.