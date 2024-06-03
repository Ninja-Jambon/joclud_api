const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
require("dotenv").config();

const app = express();
const port = config.port || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

function loadRoutes(folderName) {
  	const routesPath = path.join(__dirname, folderName);
  	const files = fs.readdirSync(routesPath);
  	files.forEach((file) => {
		if (fs.lstatSync(path.join(routesPath, file)).isDirectory()) {
			loadRoutes(`${folderName}/${file}`);
			return;
		}
		const filePath = path.join(routesPath, file);
		const route = require(filePath);
		app.use(`/${folderName}/${file.split(".")[0]}`, route);
  	});
}

loadRoutes("api");

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}/`);
});

const privateKey = fs.readFileSync("./sslcert/privkey.pem", "utf8");
const certificate = fs.readFileSync("./sslcert/fullchain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
  console.log("https server listening on port 443")
})