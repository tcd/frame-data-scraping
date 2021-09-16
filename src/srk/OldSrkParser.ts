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
        tables.each((_index, table) => {
            this.currentTable = table
            const rows = this.$(table).find("tbody > tr")
            if (rows.length != 2) { 
                return
            }
            const followingParagraph = this.$(table).next("p")
            // console.log(followingParagraph.length)
            if (followingParagraph.length === 1) {
                const nextBoldText   = this.$(followingParagraph).find("b").text()
                const nextItalicText = this.$(followingParagraph).find("i").text()
                if (this.haveNone()) {
                    if (nextBoldText == "Frame Data") { 
                        this.currentMoveData  = table 
                        return
                    }
                }
                if (this.haveFirst1()) {
                    if (nextBoldText == "Gauge Increase") { 
                        this.currentFrameData = table 
                        return
                    }
                }
                if (this.haveFirst2()) {
                    if (nextItalicText == "Comments here") { 
                        this.currentGaugeData = table 
                        this.parseCurrentData()
                    }
                }
            }
            this.currentTable = null
        })
        return true
    }

    private parseCurrentData(): void {
        let rows
        let headers
        let values
        let frameData = { }

        rows = this.$(this.currentMoveData).find("tbody > tr")
        // if (rows.length != 2) { 
        //     console.error("uh oh")
        //     process.exit(1)
        // }
        headers = this.$(rows[0]).find("td").map((index, element) => this.$(element).text().trim())
        values  = this.$(rows[1]).find("td").map((index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) {
            let key   = headers[i]
            let value = values[i]
            frameData[key] = value
        }

        rows = this.$(this.currentFrameData).find("tbody > tr")
        // if (rows.length != 2) { 
        //     console.error("uh oh")
        //     process.exit(1)
        // }
        headers = this.$(rows[0]).find("td").map((index, element) => this.$(element).text().trim())
        values  = this.$(rows[1]).find("td").map((index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) {
            let key   = headers[i]
            let value = values[i]
            frameData[key] = value
        }

        rows = this.$(this.currentGaugeData).find("tbody > tr")
        // if (rows.length != 2) { 
        //     console.error("uh oh")
        //     process.exit(1)
        // }
        headers = this.$(rows[0]).find("td").map((index, element) => this.$(element).text().trim())
        values  = this.$(rows[1]).find("td").map((index, element) => this.$(element).text().trim())
        for (let i = 0; i < values.length; i++) {
            let key   = headers[i]
            let value = values[i]
            frameData[`gagueData_${key}`] = value
        }

        this.allFrameData.push(frameData)
        this.setAllNull()
    }

    private followingParagraph(): cheerio.Cheerio {
        const p = this.$(this.currentTable).next("p")
        return p
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

export class NextParagraphData {
    public paragraphText?: string
    public nextBoldText?: string
    public nextItalicText?: string

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