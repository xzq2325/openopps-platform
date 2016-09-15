var request = require("request");
var _ = require("lodash");

module.exports = {
usa_gov_api_wrapper: function (){
	/*
	This method is used to call USAGovAPI.  Here is documentation around the api: https://github.com/usagov/Federal-Agency-Directory-API-Documentation

	We are specifically using the https://www.usa.gov/api/USAGovAPI/contacts.json/contacts endpoint.

	parameters:
	@url - the USAGovAPI endpoint, an example end point is specified above.

	returns:
	@json_obj - a json object with the filtered data from the specified USAGovAPI endpoint.
	Keys include:
		-Id
		-Agency Name (called name here)
		-Agency Description (called Description here)
		-Agency Email (called email here) - this can be any point of contact for the agency, via email
		-Agency Slug - a lower-cased version of Agency abbreviation used throughout the front end
	*/

	//calls the api
	var response_object = request("https://www.usa.gov/api/USAGovAPI/contacts.json/contacts",
		function(error, response, body){
			return response;
		});

	json_obj = JSON.parse(response_object.responseContent.body);

	//Here we write 'callbacks' for the keys within the contact object we care about
	//If the key exists, property returns true, else returns false.
	var getId = _.property('Id');
	var getName = _.property('Name');
	var getDescription = _.property('Description');
	var getEmailContact = _.property('Email');

	//here we run through the contacts object - which contains all the agencies represented in the API
	//We then parse out the information we care about.
	var contacts = _.chain( json_obj.Contacts )
		.filter( function ( contact ) {
			var allKeysExist; //allKeysExist is expected to be a boolean
			allKeysExist = _.isNumber(getId(contact));
			allKeysExist = _.isString(getName(contact));
			allKeysExist = _.isString(getDescription(contact));
			allKeyExist = _.isString(getEmailContact(contact));
			allKeyExist = getName(contact).includes("(") && getName(contact).includes(")");
			return allKeysExist;
		} )
		.map( function ( contact ) {
			return { //returns an object of data we care about.
				//immutable fields
				id: contact.Id, // get from the API
				name: contact.Name,
				slug: contact.Name.slice(contact.Name.indexOf("("),contact.Name.indexOf(")")), // something
				description: contact.Description,
				//mutable fields	
				email_contact: contact.Email, // something
				allows_restricted: true, //checkbox
			};
		});
	}

}
