const readline = require('readline');
const fs = require('fs');
const path = require('path');
const camelCase = require('camelcase');

const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CURR_DIR = process.cwd();

const createDirectoryContents = (templatePath, destinationPath, appName) => {

  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);

  // loop each file/folder
  filesToCreate.forEach(file => {
    const stats = fs.statSync(`${templatePath}/${file}`);

    if (file === 'node_modules') return;

    if (stats.isFile()) {
      const contents = fs.readFileSync(`${templatePath}/${file}`, 'utf8');

      fs.writeFileSync(`${destinationPath}/${file.replace('appName', appName)}`, contents.replace('appName', appName), 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${destinationPath}/${file}`, {recursive: true});
      // recursive call
      createDirectoryContents(`${templatePath}/${file}` , `${destinationPath}/${file}`, appName);
    }
  });
};

prompt.question("Ingrese nombre del componente: ", name => {
  prompt.write(`Creating module ${name}`);

  const filepath = `${CURR_DIR}/template`;

  const destinationPath = `${CURR_DIR}/Modules/${camelCase(name, {pascalCase: true})}`;

  fs.mkdirSync(destinationPath, {recursive: true});

  createDirectoryContents(filepath, destinationPath, name);

  prompt.close();

});

prompt.on("close", function() {
  process.exit(0);
});
