/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

const fs = require("fs-extra");
const bump = require("bump-regex");

if (!fs.existsSync("build")) {
  throw new Error("The project must be built first");
}

// Create the dist dir and copy the build into it.
fs.mkdirpSync("dist");
fs.copySync("build", "dist/build");
fs.copySync("LICENSE", "dist/LICENSE");
fs.copySync("npmjs/README.md", "dist/README.md");

// Copy the publish package into the dist dir and update the version
const packageFile = "package.json";
const publishPackageFile = "npmjs/package.json";
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