/**
 * This takes an XML feed from one page, strips all of the ids out and then requests every page from the ids
 * Using promises, the app waits until it is all finished to return all of the data
 */

var request = require('request');
var parseString = require('xml2js').parseString;
var urlString = ['https://secure.leukaemia.net.nz/registrant/FundraisingPage.aspx?registrationID=', '&langPref=en-CA&Referrer=%26Referrer%3dhttp%253a%252f%252fwww.shaveforacure.co.nz%252f#&panel1-1'];
var cheerio = require('cheerio');

var promises = [];

request('http://my.artezpacific.com/webgetservice/get.asmx/getAllRegIDs?eventID=46707&string&Source=string', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	console.log("request received")
    parseString(body, function (err, result) {
    	var reg = result.root.event_collection[0].registrant;
    	for(var i = 0; i < reg.length; i++){
    		console.log(reg.length)
    		var id = reg[i].registrantID[0];
    		console.log("Processing ID " + id);
    		promises[i] = new Promise(function(resolve, reject){
	    		request(urlString[0] + id + urlString[1], function(error, response, body){
	    			if (!error && response.statusCode == 200) {
	    				$ = cheerio.load(body);
	    				var shavee = {} 
	    				shavee.name = $("#page-name").text().trim();
	    				console.log('success')
	    				resolve(shavee);
	    			}else{
	    				console.log(error)
	    				reject(error);
	    			}
	    		})
    		})

    		if(i === reg.length - 1){
    			Promise.all(promises).then(function(shavees){
    				console.log(shavees)
    				console.log('complete', shavees.length + ' retrieved')
    			})
    		}
    	}
	});
  }
});
