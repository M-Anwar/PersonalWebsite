const fs = require('fs');
const prompt = require('prompt');
const Sftp = require('sftp-upload');

module.exports = function(info) {
	
	console.log("\n FTP Upload to: " + info.host);
	console.log("Info Param: " + info.buildPath);		

	// var files = fs.readdirSync(info.buildPath);
	// for(var i in files) {	 
	//   console.log("\t"+ files[i]);
	// }

	var uploadFTP = true;

	if(uploadFTP){
		var properties = [
			{			
				name: 'username',		  
				type: 'string',
				validator: /^[a-zA-Z\s\-]+$/,
				warning: 'Username must be only letters, spaces, or dashes',
				required: true
			},
			{			
				name: 'password',
				type: 'string',
				hidden: true,
				replace: '*',
				required: true
			}
		];
		prompt.start();

		var _username, _password;

		prompt.get(properties, function (err, result) {
			if (err) { return console.error(err); throw err;}		
			_username = result.username;
			_password = result.password;

			var options = {
		        host: info.host,
		        username: _username,
		        password: _password,
		        path: info.buildPath,
		        remoteDir: info.remoteDir        
		    },
		    sftp = new Sftp(options);

		    sftp.on('error', function(err){
		        throw err;
		    })
		    .on('uploading', function(pgs){
		        console.log('Uploading', pgs.file);
		        console.log(pgs.percent+'% completed');
		    })
		    .on('completed', function(){
		        console.log('Upload Completed');
		    })
		    .upload();		
		});
	}


 	


	
};
