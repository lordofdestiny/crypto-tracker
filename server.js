const ipList = Object.values(require("os").networkInterfaces())
    		     .flat()
    		     .filter(({ family, internal }) => family === "IPv4" && !internal)
    		     .map(({ address }) => address);

const http = require("http");
const app = require("./app");

const port = process.env.PORT ?? 3000;

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`Server listening on port ${port}.`);
	console.log(`You can access it an one of the following IP's:`);
	for(let i = 0 ; i < ipList.length; ++i) {
		console.log(`IP ${i + 1}: ${ipList[i]}`); 
	}
});
