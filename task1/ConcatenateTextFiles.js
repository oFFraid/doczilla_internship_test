import fs from "fs";
import nodePath from "path";
import GraphFile from "./GraphFile.js";

export default class ConcatenateTextFiles {
    #files = [];
    #_objMap = {};

    constructor(rootDir) {
        if (!fs.statSync(rootDir).isDirectory()) {
            throw new Error("arg rootDir must be folder!");
        }

        this.#findFiles(rootDir, (fileName) => {
            this.#files.push(new GraphFile(fileName, rootDir));
        });

        this.#sortFiles();

        this.#_objMap = this.#createFilesMapping();
    }

    getFiles() {
        return this.#files;
    }

    #createFilesMapping() {
        const obj = {};
        this.#files.forEach(({path}, i) => obj[path] = i);
        return obj;
    }

    #findFiles(dir, onFindFile) {
        let files = fs.readdirSync(dir);
        for (let i in files) {
            let name = nodePath.join(dir, files[i]);
            if (fs.statSync(name).isDirectory()) {
                this.#findFiles(name, onFindFile);
            } else {
                onFindFile(name);
            }
        }
    }

    #includeDependenciesInFile(item) {
        if (!item) {
            throw new Error("Concatenation error: param item required");
        }
        if (!item.dependencies.length) {
            return;
        }
        item.dependencies.forEach(({
            path,
            match
        }) => {
            const depItem = this.getFileByPath(path);
            if (!depItem) {
                throw new Error(
                    `Error in file ${item.path}. Unable to import file ${path} requested by the command "${match}" `
                );
            }
            this.#includeDependenciesInFile(depItem);
            item.replaceRequire(match, depItem.text);
        })
        item.dependencies = [];
    }

    getFileByPath(path) {
        return this.#files[this.#_objMap[path]];
    }

    concatFiles() {
        let outputText = "";
        this.#files.forEach((item) => {
            this.#includeDependenciesInFile(item);
            outputText += item.text;
        })
        return outputText;
    }

    #sortFiles() {
        this.#files.sort((a, b) => {
            const aIncludeA = a.findDependencyByPath(a.path);
            if (aIncludeA) {
                throw new Error(`Cyclic dependency between files: ${a.path} и ${a.path}`);
            }
            const bIncludeA = b.findDependencyByPath(a.path);
            const aIncludeB = a.findDependencyByPath(b.path);
            if (aIncludeB && bIncludeA) {
                throw new Error(`Cyclic dependency between files: ${a.path} и ${b.path}`);
            }
            if (bIncludeA) {
                return -1;
            }
            return 0;
        })
    }
}
