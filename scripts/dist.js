const fs = require("fs-extra");
const bump = require("bump-regex");

if (!fs.existsSync("build")) {
  throw new Error("The project must be built first");
}

// Create the dist dir and copy the build into it.
fs.mkdirpSync("dist");
fs.copySync("build", "dist/www");

// Copy the publish package into the dist dir and update the version
const packageFile = "package.json";
const publishPackageFile = "publish-package.json";
const distPackageFile = "dist/package.json";

const packageJson = JSON.parse(fs.readFileSync(packageFile, "utf8"));

let currentVersion = packageJson.version;
if (currentVersion.endsWith("SNAPSHOT")) {
  currentVersion = packageJson.version + "." + new Date().getTime();
}

const opts = {
  str: fs.readFileSync(publishPackageFile, "utf8"),
  version: currentVersion
};

bump(opts, function (err, res) {
  if (err) {
    throw new Error(err);
  }
  fs.writeFileSync(distPackageFile, res.str);
});