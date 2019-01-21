@echo off

netsh interface portproxy add v4tov4 listenport=4000 listenaddress=%0 connectport=4000 connectaddress=192.168.99.100
