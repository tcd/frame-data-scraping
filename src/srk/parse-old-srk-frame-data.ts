import cheerio from "cheerio"

import { OldSrkParser } from "."

export const parseOldSRKFrameData = async (character: string, data: string) => {
    try {
        const $ = cheerio.load(data)
        const parser = new OldSrkParser(character, data)
        parser.parse()
        return parser.allFrameData
    } catch (error) {
        throw error
    }
}
