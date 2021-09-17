import * as fs from "fs"
import * as converter from "json-2-csv"

export const writeJsonToTsv = (data: any, filePath: string) => {
    const options: converter.IFullOptions  = {
        delimiter: {
            field: "\t",
        },
        emptyFieldValue: "-",
    }
    converter
        .json2csvAsync(data, options)
        .then((csv: any) => {
            fs.writeFileSync(filePath, csv)
            console.log(`File written: '${filePath}'`)
        })
        .catch((err: any) => {
            console.log(`Unable to write file: '${filePath}'`)
            console.log(err)
        })
}
