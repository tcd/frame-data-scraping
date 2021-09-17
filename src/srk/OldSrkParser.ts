import cheerio from "cheerio"

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
                            this.parseCurrentData(followingParagraph.paragraphText)
                        } else if (rows.length == 4) {
                            this.parseCurrentSpecialData(followingParagraph.paragraphText)
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

    private parseCurrentSpecialData(description: string): void {
        let rows
        let headers
        let values
        let frameData = { }
        let move1 = { }
        let move2 = { }
        let move3 = { }

        // =====================================================================
        // Move Data
        // =====================================================================

        rows = this.$(this.currentMoveData).find("tbody > tr")
        if (rows.length != 4) {
            console.error(`incorrect # of rows, have '${rows.length}', expected 4`)
            return
        }
        headers = this.$(rows[0]).find("td").map((_index, element) => this.$(element).text().trim())

        values = this.$(rows[1]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move1[headers[i]] = values[i] }

        values = this.$(rows[2]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move2[headers[i]] = values[i] }

        values = this.$(rows[3]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move3[headers[i]] = values[i] }

        // =====================================================================
        // Frame Data
        // =====================================================================

        rows = this.$(this.currentFrameData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_index, element) => this.$(element).text().trim())

        values = this.$(rows[1]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move1[headers[i]] = values[i] }

        values = this.$(rows[2]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move2[headers[i]] = values[i] }

        values = this.$(rows[2]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move3[headers[i]] = values[i] }

        // =====================================================================
        // Gauge Data
        // =====================================================================

        rows = this.$(this.currentGaugeData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_index, element) => this.$(element).text().trim())

        values = this.$(rows[1]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move1[`gagueData_${headers[i]}`] = values[i] }

        values = this.$(rows[2]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move2[`gagueData_${headers[i]}`] = values[i] }

        values = this.$(rows[3]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) { move3[`gagueData_${headers[i]}`] = values[i] }

        this.allFrameData.push(move1, move2, move3)
        this.setAllNull()
    }

    private parseCurrentData(description: string): void {
        let rows
        let headers
        let values
        let frameData = { description }

        // =====================================================================
        // Move Data
        // =====================================================================

        rows = this.$(this.currentMoveData).find("tbody > tr")
        if (rows.length != 2) {
            console.error(`incorrect # of rows, have '${rows.length}', expected 2`)
            return
        }
        headers = this.$(rows[0]).find("td").map((_index, element) => this.$(element).text().trim())
        values  = this.$(rows[1]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) {
            frameData[headers[i]] = values[i]
        }

        // =====================================================================
        // Frame Data
        // =====================================================================

        rows = this.$(this.currentFrameData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_index, element) => this.$(element).text().trim())
        values  = this.$(rows[1]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) {
            frameData[headers[i]] = values[i]
        }

        // =====================================================================
        // Gauge Data
        // =====================================================================
        // FIXME: not exactly correct.

        rows = this.$(this.currentGaugeData).find("tbody > tr")
        headers = this.$(rows[0]).find("td").map((_index, element) => this.$(element).text().trim())
        values  = this.$(rows[1]).find("td").map((_index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) {
            let key   = headers[i]
            let value = values[i]
            if (key != "Move") {
                frameData[`gagueData_${key}`] = value
            }
        }

        this.allFrameData.push(frameData)
        this.setAllNull()
    }

    private followingParagraphData(): NextParagraphData {
        const p = this.$(this.currentTable).next("p")
        const nextBoldText   = this.$(p).find("b").text()
        const nextItalicText = this.$(p).find("i").text()
        return new NextParagraphData({
            paragraphText: p.text()?.trim(),
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
