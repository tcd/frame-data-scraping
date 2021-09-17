import * as fs from "fs"

import { characters } from "./characters"
import { getSRKFrameDataHTML, parseOldSRKFrameData } from "./srk"
import { writeJsonToTsv } from "./lib"

async function parse3SFrameData() {
    for (const character of characters) {
        const oldFile = `out/html/srk/old/${character}.html`
        const oldFileData = fs.readFileSync(oldFile, "utf8")
        parseOldSRKFrameData(character, oldFileData)
            .then((data) => {
                // console.log(data)
                writeJsonToTsv(data, `out/tsv/trial4/${character}.tsv`)
            })
            .catch(err => console.log(err))
    }
}

async function main() {

}

(async () => {
    await main()
    process.exit(0)
})()
