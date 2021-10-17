import * as fs from "fs"
import pkgDir from "pkg-dir"
import { FatData } from "@types"
import { writeJsonFile } from "@lib"

export const read3s = async () => {
    try {
        const rootDir = await pkgDir(__dirname)

        const dataFilePath = `${rootDir}/data/FAT/3SFrameData.json`

        const fileData = fs.readFileSync(dataFilePath, "utf8")

        const jsonData = JSON.parse(fileData)

        // console.log(Object.keys(jsonData))
        // console.log(jsonData["Makoto"]["moves"]["normal"])
        const fatData = new FatData(jsonData)
        // const normalizedData = fatData.normalize()
        // const outPath = `${rootDir}/data/FAT/.json`
        // writeJsonFile(outPath, normalizedData)

        const moveTypes = fatData.collectMoveTypes()
        console.log(JSON.stringify(moveTypes))
    } catch (error) {
       console.log(error)
       process.exit(1)
    }
}
