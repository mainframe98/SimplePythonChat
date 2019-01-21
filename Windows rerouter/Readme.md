# Routing scripts for Docker Toolbox on Windows

When using Docker with Docker Toolbox on Windows, the Docker containers are run in a virtual machine that does not have internet access on its own.

To allow the chat client to access the container, you can use the two batch scripts in this folder.

> Both scripts require administrator privileges to run.

## Reroute.bat
Reroute will route all incoming traffic to port 4000 to port 4000 to the Docker container. This script takes a single argument, which is your current ip-address.

## Deroute.bat
Deroute will remove the binding.
