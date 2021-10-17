import { isNullOrUndefined, isStringEmpty } from "@lib"
import { Combo, DamageData, FrameData, IReplacementData, MeterData, COMBO_TYPES, GUARD_TYPES } from "@types"

const PATTERNS = {
    LIFE_POINT:         /\s*\((?<lifePointDamage>\d+)\slife points\)\s*/g,
    LIFE_POINT_REMOVAL: /\s*\(\d+\slife points\)\s*/,
    ONLY_NUMBERS:       /^(\+|-)?\d+$/m,
    SPECIAL_ENDING_1:   /\([LMH][PK]\)$/igm,
    SPECIAL_ENDING_2:   /\((Jab|Strong|Fierce|Short|Forward|Roundhouse)\)$/igm,
    COMMAND_NORMAL:     /^((j\.2)|[1346])[LMH][PK]$/igm,
    GUARD: {
        ANY:        /(^(HL\/)+HL$)|(^HLx\d+$)|(^HL$)/igm,
        THROW_TECH: /(^((B|F|B\/F)\+)?LP\+LK$)/igm,
        LOW:        /(^l(?:x\d+)?)$/igm,
        OVERHEAD:   /(^h(?:x\d+)?)$/igm,
    },
}

export class OldSrkData {

    public rawData?: any
    public combo?: Combo

    public hasNeutralJumpData?: boolean
    public needsComboContent?: boolean
    public isSpecial?: boolean
    public isSuper?: boolean

    constructor(rawData: any, characterName: string) {
        this.rawData = rawData

        this.combo = new Combo()

        this.combo.character_name = characterName

        this.hasNeutralJumpData = false
        this.needsComboContent  = false
        this.isSpecial          = false
        this.isSuper            = false
    }

    public toCombo(): Combo {

        this.buildDamageData()
        this.buildMeterData()
        this.buildFrameData()

        this.addMetadata()
        this.parseCancelTypes()
        this.parseGuardType()

        this.parseDescription()
        this.parseMotion()
        this.parseMoveName()

        this.addSortOrder()
        this.parseSuperData()

        this.cleanTargetCombo()

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

    private cleanTargetCombo(): void {
        if (this.combo.combo_type != COMBO_TYPES.TARGET_COMBO) {
            return
        }

        for (let r of targetComboReplacementPatterns) {
            this.combo.content = this.combo.content.replace(r.pattern, r.replacement)
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
            this.combo.cancel_types.push("Self")
        }
        if (this.getRawValue("Special Cancel")?.toLowerCase()?.includes("yes")) {
            this.combo.cancel_types.push("Special")
        }
        if (this.getRawValue("Super Cancel")?.toLowerCase()?.includes("yes")) {
            this.combo.cancel_types.push("Super")
        }
    }

    private parseMotion(): void {
        let rawValue = this.getRawValue("Motion")
        let lowerRawValue = rawValue?.toLowerCase()

        if (lowerRawValue.includes("hold") || lowerRawValue.includes("charge")) {
            this.combo.tag_list.push("hold ok")
        }
        if (lowerRawValue.includes("mash")) {
            this.combo.tag_list.push("mash ok")
        }
        if (lowerRawValue.startsWith("(air)")) {
            this.combo.tag_list.push("air only")
        }

        if (invalidMotions.includes(lowerRawValue)) {
            this.needsComboContent = true
            return null
        }

        if (universalMechanicContent.includes(lowerRawValue)) {
            this.combo.combo_type = COMBO_TYPES.UNIVERSAL_MECHANIC
            this.combo.guard_type = GUARD_TYPES.THROW_TECH
            this.isSpecial = false
        }

        for (let r of comboReplacementPatterns) {
            rawValue = rawValue.replace(r.pattern, r.replacement)
        }

        if (rawValue.match(PATTERNS.COMMAND_NORMAL)) {
            this.isSpecial = false
            this.combo.combo_type = COMBO_TYPES.COMMAND_NORMAL
        }

        if (universalMechanicContent.includes(rawValue?.toLowerCase())) {
            this.combo.combo_type = COMBO_TYPES.UNIVERSAL_MECHANIC
            this.combo.guard_type = GUARD_TYPES.THROW_TECH
            this.isSpecial = false
        }

        this.combo.content = rawValue
    }

    private parseMoveName(): void {
        let rawValue = this.getRawValue("Move")
        if (this.isStringEmpty(rawValue)) {
            return null
        }

        let lowerRawValue = rawValue?.toLowerCase()

        if (lowerRawValue.includes("(ex)")) {
            this.combo.tag_list.push("ex")
            this.combo.combo_type = COMBO_TYPES.SPECIAL
            this.isSpecial = true
            this.isSuper   = false
        }

        if (lowerRawValue == "universal overhead") {
            this.combo.guard_type = GUARD_TYPES.OVERHEAD
            this.combo.combo_type = COMBO_TYPES.UNIVERSAL_MECHANIC
            this.isSpecial = false
            this.isSuper   = false
        }

        if (lowerRawValue.match(PATTERNS.SPECIAL_ENDING_2)) {
            this.combo.combo_type = COMBO_TYPES.SPECIAL
        }

        if (!this.isSpecial) {
                 if (lowerRawValue.includes("target combo"))         { this.combo.combo_type = COMBO_TYPES.TARGET_COMBO       }
            else if (normalNames.includes(lowerRawValue))            { this.combo.combo_type = COMBO_TYPES.NORMAL             }
            else if (commandNormalNames.includes(lowerRawValue))     { this.combo.combo_type = COMBO_TYPES.COMMAND_NORMAL     }
            else if (proximityNormalNames.includes(lowerRawValue))   { this.combo.combo_type = COMBO_TYPES.PROXIMITY_NORMAL   }
            else if (universalMechanicNames.includes(lowerRawValue)) { this.combo.combo_type = COMBO_TYPES.UNIVERSAL_MECHANIC }
            else if (uniqueMechanicNames.includes(lowerRawValue))    { this.combo.combo_type = COMBO_TYPES.UNIQUE_MECHANIC    }
        }

        for (let r of nameReplacementPatterns) {
            rawValue = rawValue.replace(r.pattern, r.replacement)
        }

        let newContent = namedMoves[lowerRawValue]
        if (!isStringEmpty(newContent)) {
            this.combo.content = newContent
        } else {
            if (rawValue.toLowerCase() != "target combo") {
                this.combo.official_name = rawValue
            }
        }

        this.combo.alternate_name = rawValue
    }

    private parseGuardType(): void {
        let lowerRawValue = this.getRawValue("Guard")?.toLowerCase()
        if (this.isStringEmpty(lowerRawValue)) {
            return null
        }

             if (lowerRawValue == "l")                           { this.combo.guard_type = GUARD_TYPES.LOW         }
        else if (lowerRawValue == "h")                           { this.combo.guard_type = GUARD_TYPES.OVERHEAD    }
        else if (lowerRawValue == "impossible")                  { this.combo.guard_type = GUARD_TYPES.UNBLOCKABLE }
        else if (lowerRawValue.match(PATTERNS.GUARD.ANY))        { this.combo.guard_type = GUARD_TYPES.ANY         }
        else if (lowerRawValue.match(PATTERNS.GUARD.THROW_TECH)) { this.combo.guard_type = GUARD_TYPES.THROW_TECH  }
        else if (lowerRawValue.match(PATTERNS.GUARD.LOW))        { this.combo.guard_type = GUARD_TYPES.LOW         }
        else if (lowerRawValue.match(PATTERNS.GUARD.OVERHEAD))   { this.combo.guard_type = GUARD_TYPES.OVERHEAD    }
    }

    private parseSuperData(): void {
        let rawValue = this.getRawValue("Super Art Name")
        if (this.isStringEmpty(rawValue)) {
            return null
        }

        this.isSuper = true
        this.combo.combo_type = COMBO_TYPES.SUPER

        this.combo.official_name = rawValue
        this.combo.sort_order = 1000
    }

    private addSortOrder(): void {
        let sortOrder = sortOrders[this.combo.content]
        if (!isNullOrUndefined(sortOrder)) {
            this.combo.sort_order = sortOrder
        }
    }

    private addMetadata(): void {
        this.setMetadata("Parry")
        this.setMetadata("Throw Range")
        this.setMetadata("Throw Range (Front)")
        this.setMetadata("Throw Range (Up & Down)")
        this.setMetadata("Kara-Throw")
        this.setMetadata("Kara-Throw Range")
        this.setMetadata("Juggle Value")
        this.setMetadata("Reset or Juggle")
        this.setMetadata("Super Art Stock")
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

    private buildMeterData(): void {
        this.parseMeterCost()
        this.parseWhiffMeterBuild()
        this.parseHitMeterBuild()
        this.parseParryMeterBuild()
        this.parseBlockMeterBuild()
    }

    private parseMeterCost(): void {
        let m = this.getRawValue("Gauge Needed")
        if (this.isStringEmpty(m)) {
            return null
        }

        if (m.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.meter_data.meter_cost = parseInt(m)
        } else {
            this.combo.meter_data.meter_cost_formula = m
        }
    }

    private parseWhiffMeterBuild(): void {
        let m = this.getRawValue("gagueData_Miss")
        if (this.isStringEmpty(m)) {
            return null
        }

        if (m.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.meter_data.whiff_meter_build = parseInt(m)
        } else {
            this.combo.meter_data.whiff_meter_build_formula = m
        }
    }

    private parseHitMeterBuild(): void {
        let m = this.getRawValue("gagueData_Hit")
        if (this.isStringEmpty(m)) {
            return null
        }

        if (m.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.meter_data.hit_meter_build = parseInt(m)
        } else {
            this.combo.meter_data.hit_meter_build_formula = m
        }
    }

    private parseParryMeterBuild(): void {
        let m = this.getRawValue("gagueData_Parry (Gauge for opponent)")
        if (this.isStringEmpty(m)) {
            return null
        }

        if (m.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.meter_data.parry_meter_build = parseInt(m)
        } else {
            this.combo.meter_data.parry_meter_build_formula = m
        }
    }

    private parseBlockMeterBuild(): void {
        let m = this.getRawValue("gagueData_Blocked")
        if (this.isStringEmpty(m)) {
            return null
        }

        if (m.match(PATTERNS.ONLY_NUMBERS)) {
            this.combo.meter_data.block_meter_build = parseInt(m)
        } else {
            this.combo.meter_data.block_meter_build_formula = m
        }
    }

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
                this.combo.tag_list.push("hard knockdown")
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
                this.combo.tag_list.push("hard knockdown")
            } else {
                this.combo.frame_data.crouching_hit_frame_advantage_formula = f
            }
        }
    }

}

const oldSrkKeys = [
    // "description",
    // "Move",
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
    // "gagueData_Miss",
    // "gagueData_Blocked",
    // "gagueData_Hit",
    // "gagueData_Parry (Gauge for opponent)",
    // "Throw Range",
    // "Kara-Throw",
    // "Kara-Throw Range",
    // "Blocked Damage",
    // "Juggle Value",
    // "Reset or Juggle",
    // "Gauge Needed",
    "gagueData_Damage",
    "gagueData_Throw Range",
    "gagueData_Chains into itself",
    "gagueData_Special Cancel",
    // "Throw Range (Front)",
    // "Throw Range (Up & Down)",
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

const comboReplacementPatterns: IReplacementData[] = [
    { replacement: "236",   pattern: /QCF/gi },
    { replacement: "214",   pattern: /QCB/gi },
    { replacement: "41236", pattern: /HCF/gi },
    { replacement: "63214", pattern: /HCB/gi },
    { replacement: "623",   pattern: /F, D, DF/gi },
    { replacement: "421",   pattern: /B, D, DB/gi },
    // =========================================================================
    { replacement: "6+LP+LK", pattern: /^F\+LP\+LK$/gim, },
    { replacement: "4+LP+LK", pattern: /^B\+LP\+LK$/gim, },
    // =========================================================================
    {
        pattern: /->/gi,
        replacement: ">",
    },
    {
        pattern: /^\(close to opponent\)\s*/gim,
        replacement: "close + ",
    },
    {
        pattern: /((hold|charge)\sB,\s*F\s*\+)/gim,
        replacement: "[4]+6+",
    },
    {
        pattern: /((hold|charge)\sD,\s*U\s*\+)/gim,
        replacement: "[2]+8+",
    },
    // =========================================================================
    { replacement: "2LP", pattern: /^D\s*\+\s*LP$/gim, },
    { replacement: "2MP", pattern: /^D\s*\+\s*MP$/gim, },
    { replacement: "2HP", pattern: /^D\s*\+\s*HP$/gim, },
    { replacement: "2LK", pattern: /^D\s*\+\s*LK$/gim, },
    { replacement: "2MK", pattern: /^D\s*\+\s*MK$/gim, },
    { replacement: "2HK", pattern: /^D\s*\+\s*HK$/gim, },

    { replacement: "j.LP", pattern: /^\(Air\)\s*LP$/gim, },
    { replacement: "j.MP", pattern: /^\(Air\)\s*MP$/gim, },
    { replacement: "j.HP", pattern: /^\(Air\)\s*HP$/gim, },
    { replacement: "j.LK", pattern: /^\(Air\)\s*LK$/gim, },
    { replacement: "j.MK", pattern: /^\(Air\)\s*MK$/gim, },
    { replacement: "j.HK", pattern: /^\(Air\)\s*HK$/gim, },

    { replacement: "6LP", pattern: /^F\s*\+\s*LP$/gim, },
    { replacement: "6MP", pattern: /^F\s*\+\s*MP$/gim, },
    { replacement: "6HP", pattern: /^F\s*\+\s*HP$/gim, },
    { replacement: "6LK", pattern: /^F\s*\+\s*LK$/gim, },
    { replacement: "6MK", pattern: /^F\s*\+\s*MK$/gim, },
    { replacement: "6HK", pattern: /^F\s*\+\s*HK$/gim, },

    { replacement: "4LP", pattern: /^B\s*\+\s*LP$/gim, },
    { replacement: "4MP", pattern: /^B\s*\+\s*MP$/gim, },
    { replacement: "4HP", pattern: /^B\s*\+\s*HP$/gim, },
    { replacement: "4LK", pattern: /^B\s*\+\s*LK$/gim, },
    { replacement: "4MK", pattern: /^B\s*\+\s*MK$/gim, },
    { replacement: "4HK", pattern: /^B\s*\+\s*HK$/gim, },

    { replacement: "c.LP", pattern: /^close\s*\+\s*LP$/gim, },
    { replacement: "c.MP", pattern: /^close\s*\+\s*MP$/gim, },
    { replacement: "c.HP", pattern: /^close\s*\+\s*HP$/gim, },
    { replacement: "c.LK", pattern: /^close\s*\+\s*LK$/gim, },
    { replacement: "c.MK", pattern: /^close\s*\+\s*MK$/gim, },
    { replacement: "c.HK", pattern: /^close\s*\+\s*HK$/gim, },
]

const targetComboReplacementPatterns: IReplacementData[] = [
    { replacement: "j.LP", pattern: /Jump\s*LP/gim, },
    { replacement: "j.MP", pattern: /Jump\s*MP/gim, },
    { replacement: "j.HP", pattern: /Jump\s*HP/gim, },
    { replacement: "j.LK", pattern: /Jump\s*LK/gim, },
    { replacement: "j.MK", pattern: /Jump\s*MK/gim, },
    { replacement: "j.HK", pattern: /Jump\s*HK/gim, },

    { replacement: "f.LP", pattern: /Far\s*LP/gim, },
    { replacement: "f.MP", pattern: /Far\s*MP/gim, },
    { replacement: "f.HP", pattern: /Far\s*HP/gim, },
    { replacement: "f.LK", pattern: /Far\s*LK/gim, },
    { replacement: "f.MK", pattern: /Far\s*MK/gim, },
    { replacement: "f.HK", pattern: /Far\s*HK/gim, },

    { replacement: "c.LP", pattern: /Close\s*LP/gim, },
    { replacement: "c.MP", pattern: /Close\s*MP/gim, },
    { replacement: "c.HP", pattern: /Close\s*HP/gim, },
    { replacement: "c.LK", pattern: /Close\s*LK/gim, },
    { replacement: "c.MK", pattern: /Close\s*MK/gim, },
    { replacement: "c.HK", pattern: /Close\s*HK/gim, },

    { replacement: "2LP", pattern: /Crouch\s*LP/gim, },
    { replacement: "2MP", pattern: /Crouch\s*MP/gim, },
    { replacement: "2HP", pattern: /Crouch\s*HP/gim, },
    { replacement: "2LK", pattern: /Crouch\s*LK/gim, },
    { replacement: "2MK", pattern: /Crouch\s*MK/gim, },
    { replacement: "2HK", pattern: /Crouch\s*HK/gim, },

    { replacement: "6LP", pattern: /Forward\s*LP/gim, },
    { replacement: "6MP", pattern: /Forward\s*MP/gim, },
    { replacement: "6HP", pattern: /Forward\s*HP/gim, },
    { replacement: "6LK", pattern: /Forward\s*LK/gim, },
    { replacement: "6MK", pattern: /Forward\s*MK/gim, },
    { replacement: "6HK", pattern: /Forward\s*HK/gim, },

    { replacement: "4LP", pattern: /Back\s*LP/gim, },
    { replacement: "4MP", pattern: /Back\s*MP/gim, },
    { replacement: "4HP", pattern: /Back\s*HP/gim, },
    { replacement: "4LK", pattern: /Back\s*LK/gim, },
    { replacement: "4MK", pattern: /Back\s*MK/gim, },
    { replacement: "4HK", pattern: /Back\s*HK/gim, },
]

const nameReplacementPatterns: IReplacementData[] = [
    { replacement: "(LP)", pattern: /\(Jab\)$/gim,        },
    { replacement: "(MP)", pattern: /\(Strong\)$/gim,     },
    { replacement: "(HP)", pattern: /\(Fierce\)$/gim,     },
    { replacement: "(LK)", pattern: /\(Short\)$/gim,      },
    { replacement: "(MK)", pattern: /\(Forward\)$/gim,    },
    { replacement: "(HK)", pattern: /\(Roundhouse\)$/gim, },
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
    "jump jab",
    "jump strong",
    "jump fierce",
    "jump short",
    "jump forward",
    "jump roundhouse",
    "crouch jab",
    "crouch strong",
    "crouch fierce",
    "crouch short",
    "crouch forward",
    "crouch roundhouse",
]

const commandNormalNames = [
    "neutral jump jab",
    "neutral jump strong",
    "neutral jump fierce",
    "neutral jump short",
    "neutral jump forward",
    "neutral jump roundhouse",
    "back jab",
    "back strong",
    "back fierce",
    "back short",
    "back forward",
    "back roundhouse",
    "forward jab",
    "forward strong",
    "forward fierce",
    "forward short",
    "forward forward",
    "forward roundhouse",
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

const universalMechanicNames = [
    "universal overhead",
]

const uniqueMechanicNames = [
    "taunt",
]

const universalMechanicContent = [
    "mp+mk",
    "lp+lk or f+lp+lk",
    "b/f/n+lp+lk",
    "f/b+lp+lk",
    "b/f+lp+lk",
    "(b)+lp+lk",
    "(f)+lp+lk",
    "(b+f)+lp+lk",
    "(b/f)+lp+lk",
    "6+lp+lk",
    "4+lp+lk",
    "lp+lk",
]

const sortOrders = {
    "LP":   110,
    "c.LP": 111,
    "f.LP": 112,
    "6LP":  113,
    "4LP":  114,
    "MP":   120,
    "c.MP": 121,
    "f.MP": 122,
    "6MP":  123,
    "4MP":  124,
    "HP":   130,
    "c.HP": 131,
    "f.HP": 132,
    "6HP":  133,
    "4HP":  134,
    "LK":   140,
    "c.LK": 141,
    "f.LK": 142,
    "MK":   150,
    "c.MK": 151,
    "f.MK": 152,
    "HK":   160,
    "c.HK": 162,
    "f.HK": 163,

    "2LP": 210,
    "2MP": 220,
    "2HP": 230,
    "2LK": 240,
    "2MK": 250,
    "2HK": 260,

    "j.LP": 310,
    "8LP":  311,
    "j.MP": 320,
    "8MP":  321,
    "j.HP": 330,
    "8HP":  331,
    "j.LK": 340,
    "8LK":  341,
    "j.MK": 350,
    "8MK":  351,
    "j.HK": 360,
    "8HK":  361,
}
