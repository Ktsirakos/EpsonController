var request = require('request'),
    username = "EPSONWEB",
    password = "admin",
    url = "http://139.91.96.201",
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

request(
    {
        url : url + "/cgi-bin/webconf",
        headers : {
            "Authorization" : auth,
            'Referer' : url + '/cgi-bin/webconf'
        }
    },
    (error, response, body) => {

        console.log(body);
        request(
        {
            url : url + "/cgi-bin/directsend?KEY=57",
            headers : {
                "Authorization" : auth,
                'Referer' : url + '/cgi-bin/webconf'
            }
        }, function(error , response , body){

            console.log(error);
        }
        
        )
    }
);