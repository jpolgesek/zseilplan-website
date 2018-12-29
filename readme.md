# Super Clever Plan - Web


## Env preparation
`sudo apt install python3 python3-pip`

`sudo python3 -m pip install -r _do_not_upload/req.txt`


## How to deploy to server

All deployment tools are in `_do_not_upload` directory

- Deploy small changes (no static assets)  
`python3 python_compile.py dev.polgesek.pl`

- Deploy all changes (with all assets)  
`python3 python_compile.py dev.polgesek.pl --upload-static-assets`


## Documentation:
[todo](#)