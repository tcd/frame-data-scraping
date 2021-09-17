import cheerio from "cheerio"

import { isNullOrUndefined } from "../lib"

export class OldSrkParser {

    public characterName?: string
    public htmlString?: string
    public $?: cheerio.Root
    public allFrameData: any[]

    public currentMoveData?:  cheerio.Element
    public currentFrameData?: cheerio.Element
    public currentGaugeData?: cheerio.Element

    public currentTable?: cheerio.Element
    public currentDescription?: string

    constructor(characterName: string, htmlString: string) {
        this.characterName = characterName
        this.htmlString    = htmlString
        this.$             = cheerio.load(htmlString)
        this.allFrameData  = []

        this.currentMoveData  = null
        this.currentFrameData = null
        this.currentGaugeData = null
        this.currentTable     = null
    }

    public parse(): boolean {
        // We want groups of [8, 8, 4]
        const tables = this.$("table")
        // console.log(tables.length)
        let just2Rows = false
        tables.each((_index, table) => {
            this.currentTable = table
            const rows = this.$(table).find("tbody > tr")
            const followingParagraph = this.followingParagraphData()
            // console.log(followingParagraph.length)
            if (followingParagraph.pLengthIsOne) {
                if (this.haveNone()) {
                    if (followingParagraph.nextBoldText == "Frame Data") {
                        this.currentMoveData = table
                        return
                    }
                }
                if (this.haveFirst1()) {
                    if (followingParagraph.nextBoldText == "Gauge Increase") {
                        this.currentFrameData = table
                        return
                    }
                }
                if (this.haveFirst2()) {
                    if (followingParagraph.nextItalicText == "Comments here" || followingParagraph.paragraphText != null) {
                        this.currentGaugeData = table
                        if (rows.length == 2) {
                            this.parseCurrentData(followingParagraph.paragraphText, 2)
                        } else if (rows.length == 4) {
                            this.parseCurrentData(followingParagraph.paragraphText, 4)
                        } else {
                            this.setAllNull()
                            return
                        }
                    }
                }
            }
            this.currentTable = null
        })
        return true
    }

    private parseCurrentData(description: string, expectedRows: number): void {
        let haveIssues = false
        let rows
        let headers
        let values
        let moves = []
        for (let i = 1; i < expectedRows; i++) { moves.push({ description }) }

        // =====================================================================
        // Move Data
        // =====================================================================

        rows    = this.$(this.currentMoveData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_, el) => this.$(el).text().trim())
        if (rows.length != expectedRows) {
            if (headers.length != 1) {
                haveIssues = true
                console.log(`incorrect # of rows in 'currentMoveData', have '${rows.length}', expected ${expectedRows} (${this.characterName})`)
                // console.log(this.$(this.currentMoveData).html())
            }
            // return
        }
        moves.forEach((move, i) => {
            values = this.$(rows[i + 1]).find("td").map((_, el) => this.$(el).text().trim())
            for (let j = 0; j < values.length; j++) {
                let value = values[j]
                let key   = headers[j]
                if (isNullOrUndefined(key)) {
                    haveIssues = true
                    console.log(`Undefined Key (${this.characterName}) - Value: '${value}'`)
                }
                moves[i][key] = value
            }
        })

        // =====================================================================
        // Frame Data
        // =====================================================================

        rows    = this.$(this.currentFrameData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_, el) => this.$(el).text().trim())
        if (rows.length != expectedRows) {
            if (headers.length != 1) {
                haveIssues = true
                console.log(`incorrect # of rows in 'currentFrameData', have '${rows.length}', expected ${expectedRows} (${this.characterName})`)
                // console.log(this.$(this.currentFrameData).html())
            }
            // return
        }
        moves.forEach((move, i) => {
            values = this.$(rows[i + 1]).find("td").map((_, el) => this.$(el).text().trim())
            for (let j = 0; j < values.length; j++) {
                let value = values[j]
                let key   = headers[j]
                if (isNullOrUndefined(key)) {
                    haveIssues = true
                    console.log(`Undefined Key (${this.characterName}) - Value: '${value}'`)
                }
                move[key] = value
            }
        })

        // =====================================================================
        // Gauge Data
        // =====================================================================

        const nonGaugeKeys = [
            "Move",
            "Motion",
            "Super Cancel",
            "Blocked Damage",
            "Stun Damage",
            "Reset or Juggle",
        ]

        rows    = this.$(this.currentGaugeData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_, el) => this.$(el).text().trim())
        if (rows.length != expectedRows) {
            if (headers.length != 1) {
                haveIssues = true
                console.log(`incorrect # of rows in 'currentGaugeData', have '${rows.length}', expected ${expectedRows} (${this.characterName})`)
                // console.log(this.$(this.currentGaugeData).html())
            }
            // return
        }
        moves.forEach((move, i) => {
            values = this.$(rows[i + 1]).find("td").map((_, el) => this.$(el).text().trim())
            for (let j = 0; j < values.length; j++) {
                let value = values[j]
                let key   = headers[j]
                if (isNullOrUndefined(key)) {
                    haveIssues = true
                    console.log(`Undefined Key (${this.characterName}) - Value: '${value}'`)
                }
                if (!nonGaugeKeys.includes(key)) {
                    move[`gagueData_${key}`] = value
                }
            }
        })

        if (haveIssues) {
            console.log(moves)
        } else {
            this.allFrameData.push(...moves)
        }
        this.setAllNull()
    }

    private followingParagraphData(): NextParagraphData {
        const p = this.$(this.currentTable).next("p")
        const nextBoldText   = this.$(p).find("b").text()
        const nextItalicText = this.$(p).find("i").text()
        return new NextParagraphData({
            paragraphText: p.text()?.trim()?.replace(/\n\s+/g, " "),
            nextBoldText,
            nextItalicText,
            pLengthIsOne: (p.length === 1),
        })
    }

    private haveFirst1(): boolean {
        return this.currentMoveData != null
    }

    private haveFirst2(): boolean {
        return this.currentMoveData  != null
            && this.currentFrameData != null
    }

    private haveAll3(): boolean {
        return this.currentMoveData  != null
            && this.currentFrameData != null
            && this.currentGaugeData != null
    }

    private haveNone(): boolean {
        return this.currentMoveData  == null
            && this.currentFrameData == null
            && this.currentGaugeData == null
    }

    private setAllNull(): void {
        this.currentMoveData  = null
        this.currentFrameData = null
        this.currentGaugeData = null
    }
}

export interface NextParagraphDataOptions {
    paragraphText: string
    nextBoldText: string
    nextItalicText: string
    pLengthIsOne: boolean
}

export class NextParagraphData {
    public paragraphText?: string
    public nextBoldText?: string
    public nextItalicText?: string
    public pLengthIsOne?: boolean

    constructor(options: NextParagraphDataOptions) {
        this.paragraphText  = options.paragraphText
        this.nextBoldText   = options.nextBoldText
        this.nextItalicText = options.nextItalicText
        this.pLengthIsOne   = options.pLengthIsOne
    }

    public boldOrItalic(): boolean {
        return this.nextBoldText  == null && this.nextItalicText == null
    }
}

const headerValues = {
    Move: "Move",
    Motion: "Motion",
    Damage: "Damage",
    StunDamage: "Stun Damage",
    ChainsIntoItself: "Chains into itself",
    SpecialCancel: "Special Cancel",
    SuperCancel: "Super Cancel",
    JuggleValue: "Juggle Value",
    Startup: "Startup",
    Hit: "Hit",
    Recovery: "Recovery",
    BlockedAdvantage: "Blocked Advantage",
    HitAdvantage: "Hit Advantage",
    CrouchingHitAdvantage: "Crouching Hit Advantage",
    Guard: "Guard",
    Parry: "Parry",
    Gauge_Miss: "Miss",
    Gauge_Blocked: "Blocked",
    Gauge_Hit: "Hit",
    Gauge_Parry: "Parry (Gauge for opponent)",
}


