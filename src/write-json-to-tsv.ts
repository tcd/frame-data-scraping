import * as fs from "fs"
import * as converter from "json-2-csv"

export const writeJsonToTsv = (data: any, fileName: string) => {
    const options: converter.IFullOptions  = {
        delimiter: {
            field: "\t",
        },
    }
    converter
        .json2csvAsync(data, options)
        .then((csv: any) => {
            fs.writeFileSync(fileName, csv)
            console.log(`File written: '${fileName}'`)
        })
        .catch((err: any) => {
            console.log(`Unable to write file: '${fileName}'`)
            console.log(err)
        })
}
