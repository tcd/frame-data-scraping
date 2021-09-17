import * as fs from "fs"
import axios from "axios"
import pkgDir from "pkg-dir"

/**
 * @param {string} character - Character name
 * @param {string} [newPage=false] - New or old page link.
 */
export const getSRKFrameDataHTML = async (character: string, newPage: boolean = false): Promise<boolean> => {
    try {
        const rootDir = await pkgDir(__dirname)
        const suffix = newPage ? "/2021" : ""
        const outFolder = newPage ? "new" : "old"

        const fileName = `${rootDir}/out/html/srk/${outFolder}/${character}.html`

        const { data } = await axios.get(`https://srk.shib.live/w/Street_Fighter_3:_3rd_Strike/${character}${suffix}`)

        fs.writeFileSync(fileName, data)
        console.log(`Wrote HTML to file: '${fileName}'`)

        return true
    } catch (error) {
        console.log(`Unable to write HTML file for character: '${character}'`)
        console.log(error)
        return false
    }
}
