import * as fs from "fs"
import cheerio from "cheerio"
import pkgDir from "pkg-dir"

export const removeImages = async () => {
    try {
        const rootDir = await pkgDir(__dirname)

        const existingFilePath = `${rootDir}/out/html/srk/old/Hugo.html`
        const newFilePath      = `${rootDir}/out/html/srk/old/Hugo-2.html`

        const fileData = fs.readFileSync(existingFilePath, "utf8")
        const $ = cheerio.load(fileData)

        // #section-collapsible-2 > div:nth-child(108) > a > img
        // const imageDivs = $("div.floatnone").remove()
        // console.log(imageDivs.length)
        $("div.floatnone").remove()

        fs.writeFileSync(newFilePath, $.html())
    } catch (error) {
       console.log(error)
       process.exit(1)
    }
}
