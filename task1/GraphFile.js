import fs from "fs";
import nodePath from "path";

export default class GraphFile {
    text = "";
    path = "";
    dependencies = [];
    #_encodingFile = "utf-8";
    #_extFile = ".txt";

    constructor(path, rootDir) {
        if (!rootDir || !path) {
            throw new Error("required params in constructor of class File!");
        }
        this.path = path;
        this.text = this.getFileText(this.path);
        this.dependencies = this.getPathsFromRequires(rootDir)
    }

    getFileText(path) {
        return fs.readFileSync(path, {
            flag: 'r',
            encoding: this.#_encodingFile
        });
    }

    findDependencyByPath(requirePath) {
        return this.dependencies.find(({path}) => path === requirePath)
    }

    replaceRequire(match, placeholderText) {
        this.text = this.text.replace(match, placeholderText)
    }

    getRequiresFromText(fileText) {
        //TODO validate path regex
        //search substring of the from "require \spacing \quote \path \quote"
        const regexRequires = /\brequire\s+(?<path>'.+'|".*?")\B/g
        return [...fileText.matchAll(regexRequires)] || [];
    }

    getPathsFromRequires(rootDir) {
        //find and delete quotes
        const regexQuotes = /['"]+/g;
        return this.getRequiresFromText(this.text)
            .map((item) => {
                const [match] = item
                const path = nodePath
                    .join(rootDir, item.groups.path + this.#_extFile)
                    .replace(regexQuotes, "");
                return {
                    match,
                    path
                };
            })
    }
}
