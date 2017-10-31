var axios = require('axios');

var api = {
	getStuffs(){
	var url = '/cars';
	var config = {};
	return axios.get(url,config)
		.then(function(res){
			return res;
		})
	}
};

module.exports = api;

