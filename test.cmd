@echo off

SET ESIA_SNILS=
SET ESIA_PSW=

start node node_modules\protractor\bin\protractor
TIMEOUT /T 20 /NOBREAK

SET JAVA_HOME=%CD%\jre
SET PATH=%CD%\jre\bin;%PATH%

echo ВЕРСИЯ JAVA должнать быть - меньше 1.8.31 (!) на 25й якутия работает. На новых НЕТ из-за SSL3.
java -version

start .\jmeter\bin\jmeter.bat -n -t .\RPGU_Test.jmx

for /l %%x in (1,1,2) do (
  start node node_modules\protractor\bin\protractor
  TIMEOUT /T 20 
  )
