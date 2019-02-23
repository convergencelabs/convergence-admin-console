const fs = require("fs");
const ncp = require("ncp");
const mkdirp = require("mkdirp");

if (!fs.existsSync("build")) {
  throw new Error("The project must be built first");
}

ncp("docker", "docker-build");
mkdirp("docker-build/www");
ncp("build", "docker-build/www");
