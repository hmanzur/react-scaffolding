const readline = require('readline');
const fs = require('fs');
const camelCase = require('camelcase');

const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CURR_DIR = process.cwd();

const createDirectoryContents = (templatePath, destinationPath, appName) => {
  fs.mkdirSync(destinationPath, {recursive: true});

  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);

  // loop each file/folder
  filesToCreate.forEach(file => {
    const stats = fs.statSync(destinationPath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(destinationPath, 'utf8');
      console.log(`Creating ${destinationPath}/${file}...`);

      fs.writeFileSync(destinationPath, contents, 'utf8');
    } else if (stats.isDirectory()) {

      // recursive call
      createDirectoryContents(`${templatePath}/${file}` , `${destinationPath}/${file}`, appName);
    }
  });
};

prompt.question("Ingrese nombre del componente: ", name => {
  prompt.write(`Creating module ${name}`);

  const filepath = `${CURR_DIR}/template`;

  const destinationPath = `${CURR_DIR}/Modules/${camelCase(name, {pascalCase: true})}`;

  createDirectoryContents(filepath, destinationPath, name);

  prompt.close();

});

prompt.on("close", function() {
  process.exit(0);
});
