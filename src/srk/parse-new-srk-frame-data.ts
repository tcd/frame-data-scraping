import cheerio from "cheerio"

export const parseNewSRKFrameData = async (character: string, data: string) => {
    try {
        const $ = cheerio.load(data)
        const allFrameData: any[] = []

        $("#section-collapsible-1 > .movedata-box").each((_index: number, el: any) => {
            const frameData: any = { }
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
            allFrameData.push(frameData)
        })
        return allFrameData
    } catch (error) {
        throw error
    }
}
