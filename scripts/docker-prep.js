const fs = require("fs-extra");

if (!fs.existsSync("build")) {
  throw new Error("The project must be built first");
}

fs.removeSync("docker-build/www");
fs.mkdirpSync("docker-build/");
fs.copySync("docker/", "docker-build");
fs.copySync("dist", "docker-build/www");
