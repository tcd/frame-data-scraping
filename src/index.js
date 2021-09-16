const fs = require("fs")
const axios = require("axios")
const cheerio = require("cheerio")
const converter = require("json-2-csv")

const { characters } = require("./characters")

const getNewSRKFrameDataHTML = async (character, newPage = false) => {
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
    }
}

const getSRKFrameData = async (character) => {
    try {
        const { data } = await axios.get(`https://srk.shib.live/w/Street_Fighter_3:_3rd_Strike/${character}/2021`)
        const $ = cheerio.load(data)
        const allFrameData = []
        const moveNames = []
        // console.log(data)

        // $('div > p.title > a').each((_idx, el) => {
        //     const postTitle = $(el).text()
        //     postTitles.push(postTitle)
        // })
        $("#section-collapsible-1 > .movedata-box").each((_index, el) => {
            const frameData = { }
            // #section-collapsible-1 > div:nth-child(4) > div.movedata-iconscol > div:nth-child(1) > big
            const name = $(el).find("div.movedata-iconscol > div:nth-child(1) > big").text()
            frameData.Name = name
            // #section-collapsible-1 > div:nth-child(4) > div.movedata-datacol > table > tbody > tr:nth-child(2)
            const row2 = $(el).find("div.movedata-datacol > table > tbody > tr:nth-child(2)")
            if (row2.length === 1) {
                const cells = $(row2).find("td")
                if (cells.length === 5) {
                    frameData["startup_frames"]                = $(cells[0]).text().trimEnd() // Startup
                    frameData["active_frames"]                 = $(cells[1]).text().trimEnd() // Active
                    frameData["whiff_recovery_frames"]         = $(cells[2]).text().trimEnd() // Recovery
                    frameData["hit_frame_advantage"]           = $(cells[3]).text().trimEnd() // Hit
                    frameData["crouching_hit_frame_advantage"] = $(cells[4]).text().trimEnd() // Cr. Hit
                }
            }
            const row4 = $(el).find("div.movedata-datacol > table > tbody > tr:nth-child(4)")
            if (row4.length === 1) {
                const cells = $(row4).find("td")
                if (cells.length === 5) {
                    frameData["damage"]                = $(cells[0]).text().trimEnd() // Damage
                    frameData["stun_damage"]           = $(cells[1]).text().trimEnd() // Stun
                    frameData["guard_type"]            = $(cells[2]).text().trimEnd() // Attack
                    frameData["parry"]                 = $(cells[3]).text().trimEnd() // Parry
                    frameData["block_frame_advantage"] = $(cells[4]).text().trimEnd() // Block
                }
            }
            // const postTitle = $(el).text()
            // postTitles.push(postTitle)
            // moveNames.push(row1.length)
            allFrameData.push(frameData)
        })
        return allFrameData
    } catch (error) {
        throw error
    }
}

for (const character of characters) {
    getNewSRKFrameDataHTML(character)
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

const writeJsonToTsv = (data, fileName) => {
    const options = {
        delimiter: {
            field: "\t",
        },
    }
    converter
        .json2csvAsync(data, options)
        .then(csv => {
            fs.writeFileSync(fileName, csv)
            console.log(`File written: '${fileName}'`)
        })
        .catch(err => {
            console.log(`Unable to write file: '${fileName}'`)
            console.log(err)
        })
}

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
