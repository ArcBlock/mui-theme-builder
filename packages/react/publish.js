const fs = require('fs-extra');
const path = require('path');
const { name, version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const distPath = path.join(__dirname, 'dist');
const packagePath = path.join(__dirname, '.package');

// prepare .package
if (fs.existsSync(packagePath)) {
  fs.rmSync(packagePath, { recursive: true });
}
fs.mkdirSync(packagePath);

// copy dist -> .package
fs.copySync(distPath, packagePath);
fs.removeSync(path.join(packagePath, 'vite.svg'));

// prepare package.json
fs.writeFileSync(
  path.join(packagePath, 'package.json'),
  JSON.stringify(
    {
      name,
      version,
      main: 'index.js',
      module: 'index.js',
      publishConfig: {
        access: 'public',
      },
    },
    null,
    2,
  ),
);
console.log('npm package.json generated');

fs.writeFileSync(path.join(packagePath, 'index.js'), 'module.exports = {};');
console.log('npm index.js generated');
