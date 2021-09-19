import * as fs from "fs"
import * as converter from "json-2-csv"

export const writeJsonToTsv = async (data: any, filePath: string) => {
    const options: converter.IFullOptions  = {
        delimiter: {
            field: "\t",
        },
        emptyFieldValue: "-",
        sortHeader: true,
    }
    try {
        const csvData = await converter.json2csvAsync(data, options)
        const cleanData = csvData.replace(/(?:_\d)+_/g, "")
        fs.writeFileSync(filePath, cleanData)
        console.log(`File written: '${filePath}'`)
    } catch (error) {
        console.log(`Unable to write file: '${filePath}'`)
        console.log(error)
    }
}
