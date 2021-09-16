import { characters } from "./characters"
import { getNewSRKFrameDataHTML } from "./srk"

for (const character of characters) {
    getNewSRKFrameDataHTML(character, true)
        .then((data) => {
            console.log(data)
        })
        .catch(err => console.log(err))
}

// for (const character of characters) {
//     const allData = {}
//     getSRKFrameData(character).then((data) => {
//         allData[character] = data
//         // convert JSON array to CSV string
//         converter.json2csvAsync(data, {delimiter: { field: "\t"} }).then(csv => {
//             // write CSV to a file
//             fs.writeFileSync(`out/${character}.tsv`, csv)
//         }).catch(err => console.log(err))
//     })
// }


// getNewSRKFrameDataHTML()
//     .then()
//     .catch(err => console.log(err))

// getFrameData("Ken")
//     // .then((data) => {})
//     .then((data) => console.log(data))

// (async () => {
//     try {
//         await saveFrameData()
//     } catch (e) {
//         // Deal with the fact the chain failed
//         console.log(e)
//     }
// })()
