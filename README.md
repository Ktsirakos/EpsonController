Turning of the projectors need 2 requests for on_off

# Epson Controller API

This API controls the Epson projectors EB-696ui for FORTH-AMI

## Installation 
Using the package manager "npm" to install the dependencies
```bash
npm install
```

## Run API server

```bash
node app.js
```
or (depends on your Node installation)
```bash
nodejs app.js
```


## Requests
The API consisted of <strong>3</strong> http requests

The name of the projectors come from the javascript file name <strong>projectors_mapping.js</strong>

The action names come from the javascript file named 
<strong>key_mapping.js</strong>


## Projectors Mapping file
```js
//Projector names together with their IP
//In order to add a projector just 
//<projectorName>:<projectorIp>
{
    "Left1" : "139.91.96.192",
    "Left2": "139.91.96.198",
    "Middle1":"139.91.96.196",
    "Middle2":"139.91.96.201",
    "Right1":"139.91.96.211",
    "Right2":"139.91.96.212",
}
```

## Action name file
```js
//Available actions (Left side)
{
    "on_off":"3B",
    "volume_up" : "56",
    "volume_down" : "57",
    "toggle_screen" : "3E",
    "search_input" : "67",
    "hdmi_change" : "46"
}
```
```js
//Request to control a single projector
POST /projector

Body: 
{
    "projector":"<<projector name>>"
    "action":"<<action name>>"
}
```

```js
//Request to control all projectors
POST /all

Body: 
{
    "action":"<<action name>>"
}
```
```js
//Request to control projectors based on a set of instructions
POST /instructions

Body: 
{
    "instructions":[
        {"projector":"<<projector name>>" , "action":"<<action  name>>"},
        .
        .
        .

    ]

}
```

```js
//Request to get the info from  all the projectors
//ATTENTION: This actions is done by running an external python script!!
GET /projectorDataAll

<NO BODY>

returns an array 

[
    {"ip" : 139.91.96.212 , "hdmi" : "HDMI1"},
    {"ip" : 139.91.96.196 , "hdmi" : "HDMI1"},
    {"ip" : 139.91.96.198 , "hdmi" : "HDMI1"},
    .
    .
]

IF no HDMI is found the program returns "404" in the HDMI position

BUG: for the projector with ip 192.91.96.192 always the HDMI is "404"
```


## Warning 
In order for the projector to power off:
The "on_off" actions has to be called twice!

## Docker installation (future work)

