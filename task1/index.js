import fs from 'fs';
import nodePath from 'path';

const folder = "./test"

class File {
    fileText = "";
    path = "";
    dependencies = [];
    encodingFile = "utf-8";
    extFile = ".txt";

    constructor(path, rootDir) {
        if (!rootDir || !path) {
            throw new Error("required params in constructor of class File!");
        }
        this.path = path;
        this.fileText = this.getFileText(this.path);
        this.dependencies = this.getPathsFromRequires(rootDir)
    }

    getFileText(path) {
        return fs.readFileSync(path, {
            flag: 'r',
            encoding: this.encodingFile
        });
    }

    findDependencyByPath(requirePath) {
        return this.dependencies.find(({path}) => path === requirePath)
    }

    replaceRequire(match, placeholderText) {
        this.fileText = this.fileText.replace(match, placeholderText)
    }

    getRequiresFromText(fileText) {
        //TODO validate path regex
        //search substring of the from "require \spacing \quote \path \quote"
        const regexRequires = /\brequire\s+(?<path>'.+'|".*?")\B/g
        return [...fileText.matchAll(regexRequires)] || [];
    }

    getPathsFromRequires(rootDir) {
        const regexQuotes = /['"]+/g;
        return this.getRequiresFromText(this.fileText)
            .map((item) => {
                const [match] = item
                const path = nodePath
                    .join(rootDir, item.groups.path + this.extFile)
                    .replace(regexQuotes, "");
                return {
                    match,
                    path
                };
            })
    }

}

class Program {
    rootDir = ""
    files = []
    objMap = {}

    constructor(rootDir) {
        if (!fs.statSync(rootDir).isDirectory()) {
            throw new Error("arg rootDir must be folder!")
        }
        this.rootDir = rootDir;

        this.findFiles(folder, (fileName) => {
            this.files.push(new File(fileName, this.rootDir));
        });

        this.sortFiles();

        this.objMap = this.createFilesMapping()
    }

    createFilesMapping() {
        const obj = {}
        this.files.forEach(({path}, i) => obj[path] = i)
        return obj
    }

    findFiles(dir, onFindFile) {
        let files = fs.readdirSync(dir);
        for (let i in files) {
            let name = nodePath.join(dir, files[i]);
            if (fs.statSync(name).isDirectory()) {
                this.findFiles(name, onFindFile);
            } else {
                onFindFile(name)
            }
        }
    }

    includeDependenciesInFile(item) {
        if (!item) {
            throw new Error("Concatenation error: param item required")
        }
        if (!item.dependencies.length) {
            return
        }
        item.dependencies.forEach(({
            path,
            match
        }) => {
            const depItem = this.getFileByPath(path);
            if (!depItem) {
                throw new Error(`Error in file ${item.path}. Unable to import file ${path} requested by the command "${match}" `)
            }
            this.includeDependenciesInFile(depItem);
            item.replaceRequire(match, depItem.fileText);
        })
        item.dependencies = [];
    }

    getFileByPath(path) {
        return this.files[this.objMap[path]];
    }

    concatFiles() {
        let outputText = "";
        this.files.forEach((item) => {
            this.includeDependenciesInFile(item)
            outputText += item.fileText
        })
        return outputText;
    }

    sortFiles() {
        this.files.sort((a, b) => {
            const bIncludeA = b.findDependencyByPath(a.path);
            const aIncludeB = a.findDependencyByPath(b.path);

            if (aIncludeB && bIncludeA) {
                throw new Error(`Cyclic dependency between files: ${a.path} и ${b.path}`)
            }
            if (bIncludeA) {
                return -1
            }
            return 0;
        })
    }
}

const saveInFile = (text, path) => {
    fs.writeFile(path, text, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

const obj = new Program(folder)
const concatenatedText = obj.concatFiles();

console.log("\nSorted list: \n")

obj.files.forEach((file) => {
    console.log("\n" + file.path + "\n")
})

saveInFile(concatenatedText, "./result.txt")
