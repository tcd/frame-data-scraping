import * as fs from "fs"
import axios from "axios"

export const getSRKFrameDataHTML = async (character: string, newPage: boolean = false): Promise<boolean> => {
    try {
        const suffix = newPage ? "/2021" : ""
        const { data } = await axios.get(`https://srk.shib.live/w/Street_Fighter_3:_3rd_Strike/${character}${suffix}`)

        const outFolder = newPage ? "new" : "old"
        const fileName = `out/html/srk/${outFolder}/${character}.html`

        fs.writeFileSync(fileName, data)
        console.log(`Wrote HTML to file: '${fileName}'`)

        return true
    } catch (error) {
        console.log(`Unable to write HTML file for character: '${character}'`)
        console.log(error)
        return false
    }
}