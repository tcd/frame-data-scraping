import * as fs from "fs"

import { writeJsonToTsv } from "./lib"
import { characters } from "./characters"
import { parseOldSRKFrameData, removeImages } from "./srk"

async function parse3SFrameData() {
    for (const character of characters) {
        const oldFile = `out/html/srk/old/${character}.html`
        const oldFileData = fs.readFileSync(oldFile, "utf8")
        await parseOldSRKFrameData(character, oldFileData)
            .then(async (data) => {
                // console.log(data)
                await writeJsonToTsv(data, `out/tsv/trial9/${character}.tsv`)
            })
            .catch(err => console.log(err))
    }
}

async function main() {
    await parse3SFrameData()
}

(async () => {
    await main()
    process.exit(0)
})()
