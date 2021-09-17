import * as fs from "fs"
import pkgDir from "pkg-dir"
import { uniq } from "lodash"

import { writeJsonToTsv } from "@lib"
import { characters } from "@data"
import { parseOldSRKFrameData } from "."

export async function parse3SFrameDataV1(trialNumber: string) {
    const rootDir = await pkgDir(__dirname)

    for (const character of characters) {
        const outFile     = `${rootDir}/out/tsv/${trialNumber}/${character}.tsv`
        const oldFile     = `${rootDir}/out/html/srk/old/${character}.html`
        const oldFileData = fs.readFileSync(oldFile, "utf8")
        await parseOldSRKFrameData(character, oldFileData)
            .then(async (data) => {
                await writeJsonToTsv(data, outFile)
            })
            .catch(err => console.log(err))
    }
}

export async function parse3SFrameDataV2(trialNumber: string) {
    const rootDir = await pkgDir(__dirname)

    for (const character of characters) {
        const outFile     = `${rootDir}/out/tsv/${trialNumber}/${character}.tsv`
        const oldFile     = `${rootDir}/out/html/srk/old/${character}.html`
        const oldFileData = fs.readFileSync(oldFile, "utf8")
        await parseOldSRKFrameData(character, oldFileData)
            .then(async (data) => {
                await writeJsonToTsv(data, outFile)
            })
            .catch(err => console.log(err))
    }
}

export async function collectKeys() {
    const rootDir = await pkgDir(__dirname)
    const allFrameData = []

    for (const character of characters) {
        const oldFile     = `${rootDir}/out/html/srk/old/${character}.html`
        const oldFileData = fs.readFileSync(oldFile, "utf8")
        await parseOldSRKFrameData(character, oldFileData)
            .then(async (data) => {
                // await writeJsonToTsv(data, `${rootDir}/out/tsv/${trialNumber}/${character}.tsv`)
                allFrameData.push(data)
                console.log(`${character} complete`)
            })
            .catch(err => console.log(err))
    }

    const keys = []
    allFrameData.flat(1).map(x => keys.push(...Object.keys(x)))
    const data = JSON.stringify(uniq(keys), null, 2)

    const filePath = `${rootDir}/out/json/3s.json`
    fs.writeFileSync(filePath, data)
    console.log(`File written: '${filePath}'`)
}
