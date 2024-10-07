const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: ["https://joclud.leizour.fr", "http://localhost:5173"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

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

app.listen(80, () => {
	console.log(`Server listening on http://localhost:80/`);
});
