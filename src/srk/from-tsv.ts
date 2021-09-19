import * as fs from "fs"
import pkgDir from "pkg-dir"
import { parse, ParseConfig, ParseResult } from "papaparse"
import { compactObject } from "@lib"
import { Combo } from "@types"

const transform = (value: string, field: string | number): any => {
    if (value === "N/A") {
        return null
    } else if (value === "-") {
        return null
    } else {
        return value
    }
}

const parseConfig: ParseConfig = {
    delimiter: "\t",
    header: true,
    dynamicTyping: true,
    transform: transform,
}

export const fromTSV = async () => {
    try {
        const rootDir  = await pkgDir(__dirname)
        const inFilePath  = `${rootDir}/out/tsv/all-moves-clean.tsv`
        const outFilePath = `${rootDir}/out/json/all-moves-clean.json`

        const fileData = fs.readFileSync(inFilePath, "utf8")

        let result = parse(fileData, parseConfig)
        let compactResults = result.data.map(x => compactObject(x))
        let outData = JSON.stringify(result.data, null, 2)

        fs.writeFileSync(outFilePath, outData)
    } catch (error) {
       console.log(error)
       process.exit(1)
    }
}

export const fromTsvToCombo = async () => {
    try {
        const rootDir  = await pkgDir(__dirname)
        const inFilePath  = `${rootDir}/out/tsv/all-moves-clean.tsv`
        const outFilePath = `${rootDir}/out/json/all-combos-clean.json`

        const fileData = fs.readFileSync(inFilePath, "utf8")

        let result = parse(fileData, parseConfig)
        let combos = result.data.map(x => Combo.fromJSON(x).toJSON())
        let outData = JSON.stringify(combos, null, 2)

        fs.writeFileSync(outFilePath, outData)
    } catch (error) {
       console.log(error)
       process.exit(1)
    }
}
