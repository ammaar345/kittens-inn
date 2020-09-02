const figlet = require("figlet-promised");

// figlet("async/await", function(err,result){
// 	console.log(result)
// });

// figlet("async/await")
// 	.then(function(result)  {
// 		console.log(result)
// 	});

async function go() {
	const result = await figlet("async/await");
	console.log(result);
}

go();
