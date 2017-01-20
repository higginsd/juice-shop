'use strict'

var utils = require('../lib/utils');
var mime = require('mime');
var http = require('http');

exports = module.exports = function fileDownload () 
{
	return function (req, res) 
	{
		var myfile = req.query.file;
		// URLs look like http://mps.milwaukee.k12.wi.us/MPS-English/COO/Documents/Menus/LunchTraditionalHighSchoolMenuJANUARY2017.pdf
		var menuURL = "http://mps.milwaukee.k12.wi.us" + myfile;
		console.log (myfile);
	
		try 
		{
			http.get(menuURL, (res2) => 
			{
			  const statusCode = res2.statusCode;
			  const contentType = res2.headers['content-type'];
			
			  let error;
			  if (statusCode !== 200) 
			  {
			    error = new Error(`Request Failed.\n` +
			                      `Status Code: ${statusCode}`);
			  } 
			  if (error) 
			  {
			    console.log(error.message);
			    res.setHeader('Content-type', 'text/html');
			    res.write(error.message);
			    res.status(500).end();
			    // consume response data to free up memory
			    res2.resume();
			    return;
			  }
			  			
				let rawData = '';
				
			  res.setHeader('Content-disposition', 'attachment; filename=' + 'menu.pdf');
			  res.setHeader('Content-type', contentType);
			  res2.on ('data', (chunk) => res.write( chunk ));
			
				res2.on('end', () => 
				{
			  	try
			  	{
			  		//res.write(rawData, 'utf8');
			  		res.status(200).end();
			  	}
					catch (e) 
					{
				    res.write(e.message);
			  		res.status(500).end();
			    }
				}).on('error', (e) => 
				{
				    res.write(e.message);
			  		res.status(500).end();
			  });
			}).on('error', (e) => 
				{
				    res.write(e.message);
			  		res.status(500).end();
			  });
		}
		catch (e)
		{
			console.log (e.message);
		}
	  return;
	}
}
