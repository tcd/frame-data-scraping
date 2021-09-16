import * as fs from "fs"

import { characters } from "./characters"
import { parseNewSRKFrameData, parseOldSRKFrameData } from "./srk"
import { writeJsonToTsv } from "./write-json-to-tsv"


for (const character of characters) {
    const oldFile = `out/html/srk/old/${character}.html`
    const oldFileData = fs.readFileSync(oldFile, "utf8")
    parseOldSRKFrameData(character, oldFileData)
        .then((data) => {
            // console.log(data)
            writeJsonToTsv(data, `out/tsv/trial3/${character}.tsv`)
        })
        .catch(err => console.log(err))
}