@echo off

SET ESIA_SNILS=
SET ESIA_PSW=

start node node_modules\protractor\bin\protractor
TIMEOUT /T 20 /NOBREAK

SET JAVA_HOME=%CD%\jre
SET PATH=%CD%\jre\bin;%PATH%

echo ������ JAVA �������� ���� - ����� 1.8.31 (!) �� 25� ���� ࠡ�⠥�. �� ����� ��� ��-�� SSL3.
java -version

start .\jmeter\bin\jmeter.bat -n -t .\RPGU_Test.jmx

for /l %%x in (1,1,2) do (
  start node node_modules\protractor\bin\protractor
  TIMEOUT /T 20 
  )
