import fs from 'fs';
import ConcatenateTextFiles from "./ConcatenateTextFiles.js";

const main = () => {
    let [dirPath, concatFilesPath] = process.argv.slice(2);
    if (!dirPath) {
        throw new Error("dirPath arg must be");
    }
    if (!concatFilesPath) {
        concatFilesPath = "./result.txt";
        console.log(`WARNING: the file will be saved to the default path ${concatFilesPath} since no other path has been passed`);
    }
    const saveInFile = (text, path) => {
        fs.writeFile(path, text, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`The file was saved in ${path}!`);
        });
    }

    const textFiles = new ConcatenateTextFiles(dirPath);
    const concatenatedText = textFiles.concatFiles();

    console.log("Sorted list: ");

    textFiles.getFiles().forEach((file) => {
        console.log(file.path);
    })
    if (concatFilesPath) {
        saveInFile(concatenatedText, concatFilesPath);
    }
}

main();
