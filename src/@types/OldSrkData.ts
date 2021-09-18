import { isEmpty, uniq } from "lodash"

import { COMBO_TYPES, GUARD_TYPES } from "@data"
import { isStringEmpty } from "@lib"
import { Combo, IReplacementData } from "@types"

const PATTERNS = {
    LIFE_POINT:         /\s*\((?<lifePointDamage>\d+)\slife points\)\s*/g,
    LIFE_POINT_REMOVAL: /\s*\(\d+\slife points\)\s*/,
    ONLY_NUMBERS:       /^(\+|-)?\d+$/m,
    GUARD: {
        ANY: /(^(HL\/)+HL$)|(^HLx\d+$)|(^HL$)/gm,
        THROW_TECH: /^((B|F|B\/F)\+)?LP\+LK$/gm
    },
}

export class OldSrkData {

    public rawData?: any
    public combo?: Combo

    public comboContent?: string
    public tag_list: string[]
    public cancel_types: string[]

    public hasNeutralJumpData?: boolean
    public needsComboContent?: boolean
    public isSpecial?: boolean
    public isSuper?: boolean

    constructor(rawData: any) {
        this.rawData = rawData

        this.combo = {
            metadata: {},
            damage_data: {},
            frame_data: {},
            meter_data: {},
        }

        this.comboContent = ""
        this.tag_list = []
        this.cancel_types = []

        this.hasNeutralJumpData = false
        this.needsComboContent  = false
        this.isSpecial          = false
        this.isSuper            = false
    }

    public toCombo(): Combo {

        this.buildDamageData()
        this.buildMeterData()
        this.buildFrameData()

        // this.addMetadata()
        this.parseCancelTypes()
        this.parseGuardType()

        this.parseDescription()
        this.parseMotion()
        this.parseMoveName()

        if (this.tag_list.length > 0) {
            this.combo.tag_list = uniq(this.tag_list).join(", ")
        }

        if (this.cancel_types.length > 0) {
            this.combo.cancel_types = uniq(this.cancel_types).join(", ")
        }

        // if (this.combo.tag_list.length == 0)     { delete(this.combo.tag_list)     }
        // if (this.combo.cancel_types.length == 0) { delete(this.combo.cancel_types) }
        if (isEmpty(this.combo.damage_data))     { delete(this.combo.damage_data)  }
        if (isEmpty(this.combo.frame_data))      { delete(this.combo.frame_data)   }
        if (isEmpty(this.combo.meter_data))      { delete(this.combo.meter_data)   }
        if (isEmpty(this.combo.metadata))        { delete(this.combo.metadata)     }

        return this.combo
    }

    private getRawValue(key: string): string {
        return this.rawData[key]?.trim()
    }

    private isStringEmpty(value: string): boolean {
        return (value == "-" || value == "?" || isStringEmpty(value))
    }

    private setMetadata(key: string): void {
        let value = this.getRawValue(key)
        if (!this.isStringEmpty(value)) {
            this.combo.metadata[key] = value
        }
    }

    // =========================================================================
    // Misc.
    // =========================================================================

    private parseDescription(): void {
        let rawValue = this.getRawValue("description")
        if (this.isStringEmpty(rawValue)) {
            return null
        }

        let lowerRawValue = rawValue?.toLowerCase()
        if (lowerRawValue == "comments here")   { return null }
        if (lowerRawValue == "clay added this") { return null }

        this.combo.description = rawValue
    }

    private parseCancelTypes(): void {
        if (this.getRawValue("Chains into itself")?.toLowerCase()?.includes("yes")) {
            this.cancel_types.push("Self")
        }
        if (this.getRawValue("Special Cancel")?.toLowerCase()?.includes("yes")) {
            this.cancel_types.push("Special")
        }
        if (this.getRawValue("Super Cancel")?.toLowerCase()?.includes("yes")) {
            this.cancel_types.push("Super")
        }
    }

    private parseMotion(): void {
        let rawValue = this.getRawValue("Motion")
        let lowerRawValue = rawValue?.toLowerCase()

        if (lowerRawValue.includes("hold") || lowerRawValue.includes("charge")) {
            this.tag_list.push("hold ok")
        }
        if (lowerRawValue.includes("mash")) {
            this.tag_list.push("mash ok")
        }

        if (invalidMotions.includes(lowerRawValue)) {
            this.needsComboContent = true
            return null
        }

        // for (let r of comboReplacementPatterns) {
        //     rawValue.replace(r.pattern, r.replacement)
        // }

        this.combo.content = rawValue
    }

    private parseMoveName(): void {
        let rawValue = this.getRawValue("Move")
        if (this.isStringEmpty(rawValue)) {
            return null
        }

        let lowerRawValue = rawValue?.toLowerCase()

        if (lowerRawValue.includes("(ex)")) {
            this.tag_list.push("EX")
            this.combo.combo_type = COMBO_TYPES.SPECIAL
            this.isSpecial = true
        }

        if (!this.isSpecial) {
                 if (normalNames.includes(lowerRawValue))          { this.combo.combo_type = COMBO_TYPES.NORMAL           }
            else if (commandNormalNames.includes(lowerRawValue))   { this.combo.combo_type = COMBO_TYPES.COMMAND_NORMAL   }
            else if (proximityNormalNames.includes(lowerRawValue)) { this.combo.combo_type = COMBO_TYPES.PROXIMITY_NORMAL }
            else if (lowerRawValue.includes("target combo"))       { this.combo.combo_type = COMBO_TYPES.TARGET_COMBO     }
        }

        if (this.needsComboContent) {
            let newContent = namedMoves[lowerRawValue]
            if (!isStringEmpty(newContent)) {
                this.combo.content = newContent
            }
        }

        this.combo.alternate_name = rawValue
    }

    private parseGuardType(): void {
        let rawValue = this.getRawValue("description")?.toLowerCase()
        if (this.isStringEmpty(rawValue)) {
            return null
        }

             if (rawValue == "l")                           { this.combo.guard_type = GUARD_TYPES.LOW        }
        else if (rawValue == "h")                           { this.combo.guard_type = GUARD_TYPES.OVERHEAD   }
        else if (rawValue.match(PATTERNS.GUARD.ANY))        { this.combo.guard_type = GUARD_TYPES.ANY        }
        else if (rawValue.match(PATTERNS.GUARD.THROW_TECH)) { this.combo.guard_type = GUARD_TYPES.THROW_TECH }
    }

    private addMetadata(): void {
        this.setMetadata("Parry")
        this.setMetadata("Throw Range")
        this.setMetadata("Kara-Throw")
        this.setMetadata("Kara-Throw Range")
        this.setMetadata("Juggle Value")
        this.setMetadata("Reset or Juggle")
    }

    // =========================================================================
    // Damage Data
    // =========================================================================

    private buildDamageData(): void {
        this.parseDamage()
        this.parseStunDamage()
        this.parseBlockDamage()
    }

    private parseDamage(): void {
        let d = this.getRawValue("Damage")

        if (this.isStringEmpty(d)) {
            return null
        }

        const result = PATTERNS.LIFE_POINT.exec(d)
        const lifePointDamage = result?.groups?.lifePointDamage
        if (lifePointDamage) {
            this.combo.damage_data.life_point_damage = parseInt(lifePointDamage)
            d = d.replace(PATTERNS.LIFE_POINT_REMOVAL, "")?.trim()
            if (d.match(PATTERNS.ONLY_NUMBERS)) {
                this.combo.damage_data.damage = parseInt(d)
            } else {
                this.combo.damage_data.damage_formula = d
            }
        }
    }

    private parseStunDamage(): void {
        let d = this.getRawValue("Stun Damage")

        if (this.isStringEmpty(d)) {
            return null
        }

        if (d.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.damage_data.stun_damage = parseInt(d)
        } else {
            this.combo.damage_data.stun_damage_formula = d
        }
    }

    private parseBlockDamage(): void {
        let d = this.getRawValue("Blocked Damage")

        if (this.isStringEmpty(d)) {
            return null
        }

        if (d.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.damage_data.chip_damage = parseInt(d)
        } else {
            this.combo.damage_data.chip_damage_formula = d
        }
    }

    // =========================================================================
    // Meter Data
    // =========================================================================

    private buildMeterData(): void { }

    // =========================================================================
    // Frame Data
    // =========================================================================

    private buildFrameData(): void {
        this.parseStartupFrames()
        this.parseActiveFrames()
        this.parseRecoveryFrames()
        this.parseBlockAdvantage()
        this.parseHitAdvantage()
        this.parseCrouchingHitAdvantage()
    }

    private parseStartupFrames(): void {
        let f = this.getRawValue("Startup")?.toLowerCase()
        if (this.isStringEmpty(f)) {
            return null
        }

        if (f.includes("neutral jump")) {
            this.hasNeutralJumpData = true
        }

        if (f.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.frame_data.startup_frames = parseInt(f)
        } else {
            this.combo.frame_data.startup_frames_formula = f
        }
    }

    private parseActiveFrames(): void {
        let f = this.getRawValue("Hit")?.toLowerCase()

        if (this.isStringEmpty(f)) {
            return null
        }

        if (f.includes("neutral jump")) {
            this.hasNeutralJumpData = true
        }
        if (f.includes("until landing")) {
            this.combo.frame_data.active_until_landing = true
        }
        if (f.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.frame_data.active_frames = parseInt(f)
        } else {
            this.combo.frame_data.active_frames_formula = f
        }
    }

    private parseRecoveryFrames(): void {
        let f = this.getRawValue("Recovery")?.toLowerCase()

        if (this.isStringEmpty(f)) {
            return null
        }

        if (f.includes("neutral jump")) {
            this.hasNeutralJumpData = true
        }
        if (f.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.frame_data.whiff_recovery_frames = parseInt(f)
        } else {
            this.combo.frame_data.whiff_recovery_frames_formula = f
        }
    }

    private parseBlockAdvantage(): void {
        let f = this.getRawValue("Blocked Advantage")?.toLowerCase()

        if (this.isStringEmpty(f)) {
            return null
        }

        if (f.includes("neutral jump")) {
            this.hasNeutralJumpData = true
        }
        if (f.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.frame_data.block_frame_advantage = parseInt(f)
        } else {
            this.combo.frame_data.block_frame_advantage_formula = f
        }
    }

    private parseHitAdvantage(): void {
        let f = this.getRawValue("Hit Advantage")?.toLowerCase()

        if (this.isStringEmpty(f)) {
            return null
        }

        if (f.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.frame_data.hit_frame_advantage = parseInt(f)
        } else {
            if (f.includes("down") || f.includes("kd")) {
                this.tag_list.push("hard knockdown")
            } else {
                this.combo.frame_data.hit_frame_advantage_formula = f
            }
        }
    }

    private parseCrouchingHitAdvantage(): void {
        let f = this.getRawValue("Crouching Hit Advantage")?.toLowerCase()

        if (this.isStringEmpty(f)) {
            return null
        }

        if (f.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.frame_data.crouching_hit_frame_advantage = parseInt(f)
        } else {
            if (f.includes("down") || f.includes("kd")) {
                this.tag_list.push("hard knockdown")
            } else {
                this.combo.frame_data.crouching_hit_frame_advantage_formula = f
            }
        }
    }

}

const oldSrkKeys = [
    // "description",
    "Move",
    // "Motion",
    // "Damage",
    // "life_point_damage",
    // "Stun Damage",
    // "Chains into itself",
    // "Special Cancel",
    // "Super Cancel",
    // "Startup",
    // "Hit",
    // "Recovery",
    // "Blocked Advantage",
    // "Hit Advantage",
    // "Crouching Hit Advantage",
    // "Guard",
    // "Parry",
    "gagueData_Miss",
    "gagueData_Blocked",
    "gagueData_Hit",
    "gagueData_Parry (Gauge for opponent)",
    // "Throw Range",
    // "Kara-Throw",
    // "Kara-Throw Range",
    // "Blocked Damage",
    // "Juggle Value",
    // "Reset or Juggle",
    "Gauge Needed",
    "gagueData_Damage",
    "gagueData_Throw Range",
    "gagueData_Chains into itself",
    "gagueData_Special Cancel",
    "Throw Range (Front)",
    "Throw Range (Up & Down)",
    "gagueData_Num.",
    "gagueData_Super Art",
    "gagueData_Super Art Stock",
    "gagueData_Damage/Gauge",
    "gagueData_Gauge Needed",
    "gagueData_Juggle Value",
    "gagueData_Kara-Throw",
    "gagueData_Kara-Throw Range",
    "Super Art",
    "Super Art Name",
    "Super Art Stock",
    "Damage/Gauge",
]

const invalidMotions = [
    "",
    "-",
    "+",
    "++",
    "+ or +",
    "(Air)",
    "Hold ,+",
    "Hold ,+(Hold )",
]

const comboReplacementStrings = {
    "QCF": "236",
    "QCB": "214",
    "HCF": "41236",
    "HCB": "63214",
    "F, D, DF": "623",
    "B, D, DB": "421",
    "(Close to opponent)": "close +",
    // "(Air) ": "j.",
}

const comboReplacementPatterns: IReplacementData[] = [
    {
        pattern: /QCF/i,
        replacement: "236",
    },
    {
        pattern: /QCB/i,
        replacement: "214",
    },
    {
        pattern: /HCF/i,
        replacement: "41236",
    },
    {
        pattern: /HCB/i,
        replacement: "63214",
    },
    {
        pattern: /F, D, DF/i,
        replacement: "623",
    },
    {
        pattern: /B, D, DB/i,
        replacement: "421",
    },
    {
        pattern: /^\(close to opponent\)\s*/im,
        replacement: "close + ",
    },
]

const namedMoves = {

    "taunt": "HP+HK",
    "universal overhead": "MP+MK",

    "jab":    "LP",
    "strong": "MP",
    "fierce": "HP",

    "short":      "LK",
    "forward":    "MK",
    "roundhouse": "HK",

    "close jab":    "c.LP",
    "close strong": "c.MP",
    "close fierce": "c.HP",
    "far jab":      "f.LP",
    "far strong":   "f.MP",
    "far fierce":   "f.HP",

    "close short":      "c.LK",
    "close forward":    "c.MK",
    "close roundhouse": "c.HK",
    "far short":        "f.LK",
    "far forward":      "f.MK",
    "far roundhouse":   "f.HK",

    "crouch jab":        "2LP",
    "crouch strong":     "2MP",
    "crouch fierce":     "2HP",
    "crouch short":      "2LK",
    "crouch forward":    "2MK",
    "crouch roundhouse": "2HK",

    "jump jab":        "j.LP",
    "jump strong":     "j.MP",
    "jump fierce":     "j.HP",
    "jump short":      "j.LK",
    "jump forward":    "j.MK",
    "jump roundhouse": "j.HK",

    "neutral jump jab":        "8LP",
    "neutral jump strong":     "8MP",
    "neutral jump fierce":     "8HP",
    "neutral jump short":      "8LK",
    "neutral jump forward":    "8MK",
    "neutral jump roundhouse": "8HK",
}

const normalNames = [
    "jab",
    "strong",
    "fierce",
    "short",
    "forward",
    "roundhouse",
]

const commandNormalNames = [
    "neutral jump jab",
    "neutral jump strong",
    "neutral jump fierce",
    "neutral jump short",
    "neutral jump forward",
    "neutral jump roundhouse",
]

const proximityNormalNames = [
    "close jab",
    "close strong",
    "close fierce",
    "far jab",
    "far strong",
    "far fierce",

    "close short",
    "close forward",
    "close roundhouse",
    "far short",
    "far forward",
    "far roundhouse",
]
