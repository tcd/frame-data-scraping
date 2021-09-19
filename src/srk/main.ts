import * as fs from "fs"
import pkgDir from "pkg-dir"
import { uniq } from "lodash"

import { flattenObject, writeJsonToTsv } from "@lib"
import { characters } from "@data"
import { parseOldSRKFrameData } from "."

export async function parse3SFrameData(trialNumber: string) {
    try {
        const rootDir = await pkgDir(__dirname)

        for (const character of characters) {
            const outFile     = `${rootDir}/out/tsv/${trialNumber}/${character}.tsv`
            const oldFile     = `${rootDir}/out/html/srk/old/${character}.html`
            const oldFileData = fs.readFileSync(oldFile, "utf8")
            await parseOldSRKFrameData(character, oldFileData)
                .then(async (moves) => {
                    let data = moves.map(x => x.toCombo())
                    await writeJsonToTsv(data, outFile)
                })
                .catch(err => console.log(err))
        }
    } catch (error) {
        console.log(error)
    }
}

export async function collectAllDataTSV() {
    try {
        const rootDir      = await pkgDir(__dirname)
        const outFile      = `${rootDir}/out/tsv/all-moves-v3.tsv`
        const allFrameData = []

        for (const character of characters) {
            const oldFile     = `${rootDir}/out/html/srk/old/${character}.html`
            const oldFileData = fs.readFileSync(oldFile, "utf8")
            await parseOldSRKFrameData(character, oldFileData)
                .then(async (data) => {
                    allFrameData.push(data)
                    console.log(`${character} complete`)
                })
                .catch(err => console.log(err))
        }

        let outData = allFrameData.flat(1).map(x => x.toCombo().thickData())

        await writeJsonToTsv(outData, outFile)
    } catch (error) {
        console.log(error)
    }
}

export async function collectAllDataJSON() {
    try {
        const rootDir      = await pkgDir(__dirname)
        const outFile      = `${rootDir}/out/json/all-moves-v2.json`
        const allFrameData = []

        for (const character of characters) {
            const oldFile     = `${rootDir}/out/html/srk/old/${character}.html`
            const oldFileData = fs.readFileSync(oldFile, "utf8")
            await parseOldSRKFrameData(character, oldFileData)
                .then(async (moves) => {
                    let data = moves.map(x => flattenObject(x.toCombo().thickData()))
                    allFrameData.push(...data)
                    console.log(`${character} complete`)
                })
                .catch(err => console.log(err))
        }

        let outData = JSON.stringify(allFrameData.flat(1), null, 2)

        fs.writeFileSync(outFile, outData)
        console.log(`File written: '${outFile}'`)
    } catch (error) {
        console.log("unable to write file")
        console.log(error)
    }
}
