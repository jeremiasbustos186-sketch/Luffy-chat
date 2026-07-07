@echo off
echo ============================================
echo   Desplegando luffy-chat a surge.sh...
echo ============================================
echo.
echo Necesitas una cuenta en surge.sh (gratis).
echo Ingresa tu email y contraseña cuando se lo pidan.
echo Si es la primera vez, se creará la cuenta automáticamente.
echo.
cd /d "%~dp0"
npx surge . --domain luffy-chat-jeremias.surge.sh
echo.
echo Si el deploy fue exitoso, tu sitio estará en:
echo https://luffy-chat-jeremias.surge.sh
pause
