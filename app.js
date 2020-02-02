const express = require('express')
const request = require('request');
const spawn = require("child_process").spawn;
const app = express()
const port = 3000

const projectors = require("./projectors_mapping").projectors;
const keyMapping = require("./key_maping").keymapping;

const username = "EPSONWEB"
const password = "admin"
const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
// const headers = {
//     "Authentication" : auth,
//     'Referer' : projectors["Left1"] + '/cgi-bin/webconf'
// }

console.log(projectors, keyMapping);


function makeRequest(projectorIp, keymapping) {
    request({
            url: `http://${projectorIp}/cgi-bin/directsend?KEY=${keymapping}`,
            headers: {
                "Authorization": auth,
                'Referer': "http://" + projectorIp + '/cgi-bin/webconf'
            }
        }, function (error, response, body) {
            if (error != null) console.log(error);
        }

    )
}

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.get('/', (req, res) => res.send('Hello World!'))


app.post('/projector', (req, res) => {

    makeRequest(projectors[req.body.projector], keyMapping[req.body.action])
    res.sendStatus(200);

})


app.post('/all', (req, res) => {

    console.log("-----------------------")
    for (projector in projectors) {
        console.log(`[ALL]: ${req.body.action} on ${projectors[projector]}`);
        makeRequest(projectors[projector], keyMapping[req.body.action]);
    }
    console.log("-----------------------")
    res.send(200);
})

app.post('/instructions', (req, res) => {
    var instructions = req.body.instructions;

    res.status(200).send(req.body.instructions);
    instructions.forEach((instruction) => {
        console.log("[INSTRUCTIONS]: Executing ", instruction.action, "on", instruction.projector);
        if (instruction.action == "sleep") {
            console.log("[INSTRUCTIONS] Sleep action for ", instruction.time, "miliseconds");
            sleep.msleep(instruction.time);
        } else {
            makeRequest(projectors[instruction.projector], keyMapping[instruction.action]);
            sleep.msleep(1000);
        }
    })


})



function runPythonScript(ip){
    return new Promise((resolve , reject) => {
        const pythonProcess = spawn('python', ["workingOnpython.py", "ip", ip]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(ip, data.toString().replace(/\r\n$/, ''));
            resolve({"ip" : ip , "hdmi"  : data.toString().replace(/\r\n$/, '')});
        })
    })
}


var projectorsIps = [
    "139.91.96.192",
    "139.91.96.198",
    "139.91.96.196",
    "139.91.96.201",
    "139.91.96.211",
    "139.91.96.212",
]

app.get('/projectorDataAll', async (req, res) => {

    var returnMessage = await Promise.all(projectorsIps.map(projector => runPythonScript(projector)))
    console.log(returnMessage);
    res.send(returnMessage);

})


app.get('/projectorData', (req, res) => {


    const pythonProcess = spawn('python', ["workingOnpython.py", "ip", req.query.projectorIp]);

    pythonProcess.stdout.on('data', (data) => {
        res.send({
            "hdmi": data.toString().replace(/\r\n$/, '')
        })
    })

    ///////////////////////////
    // var Ip = req.query.projectorIp;

    // request.post("http://139.91.96.201/cgi-bin/webconf" , {
    //     json : {
    //         "page" : "05"
    //     },
    //     headers : {
    //         "Authorization" : auth,
    //         'Referer' : "http://" + Ip + '/cgi-bin/webconf'
    //     }   
    // } , (error , res , body) => {
    //     if(error) {
    //         console.error(error);
    //         return;
    //     }

    //     console.log(`statusCode ${res.statusCode}`)
    //     console.log(body)
    // })


    // res.send("Done").status(200);

    //run 2, embeded python script to run just that
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))