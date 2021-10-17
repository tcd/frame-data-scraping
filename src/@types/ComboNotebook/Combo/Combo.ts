import { isEmpty, uniq } from "lodash"

import { compactArray, compactObject } from "@lib"
import { COMBO_TYPE_IDS, GUARD_TYPE_IDS, CANCEL_TYPE_IDS } from "@types"
import { characterIds } from "@data"

import { FrameData } from "./FrameData"
import { DamageData } from "./DamageData"
import { MeterData } from "./MeterData"
import { DamageDataV2, FrameDataV2, MeterDataV2 } from "./v2"

export class Combo {

    constructor() {
        this.metadata = {}

        this.tag_list     = []
        this.cancel_types = []

        this.damage_data = new DamageData()
        this.frame_data  = new FrameData()
        this.meter_data  = new MeterData()

        this.damage_data_v2 = new DamageDataV2()
        this.frame_data_v2  = new FrameDataV2()
        this.meter_data_v2  = new MeterDataV2()
    }

    public confirmed?: boolean
    public sort_order?: number
    public animation_url?: string
    public youtube_link?: string
    public youtube_video_data?: any
    public conditions?: string
    public difficulty?: number
    // Name
    public official_name?: string
    public alternate_name?: string
    public description?: string
    public which_display_name?: string
    // Content
    public content?: string
    public human_readable_combo?: string
    public machine_readable_combo?: string
    public html_content?: string
    public which_notation_style?: string
    // Hit Data
    public hits?: number
    public max_hits?: number
    public min_hits?: number

    public tag_list?: string[]
    public metadata?: any

    public damage_data?: Partial<DamageData>
    public frame_data?: Partial<FrameData>
    public meter_data?: Partial<MeterData>

    public damage_data_v2?: Partial<DamageDataV2>
    public frame_data_v2?: Partial<FrameDataV2>
    public meter_data_v2?: Partial<MeterDataV2>

    // =========================================================================
    // New for scraping
    // =========================================================================
    public game_character_id?: number
    public combo_type_id?: number
    public guard_type_id?: number
    public cancel_type_ids?: number[]

    public character_name?: string
    public combo_type?: string
    public guard_type?: string
    public cancel_types?: string[]

    // =========================================================================
    // Private Methods
    // =========================================================================

    private getGameCharacterId(ids): number {
        return ids[this.character_name]
    }

    private getComboTypeId(): number {
        return COMBO_TYPE_IDS[this.combo_type] || null
    }

    private getGuardTypeId(): number {
        return GUARD_TYPE_IDS[this.guard_type] || null
    }

    private getCancelTypeIds(): number[] {
        if (!(this.cancel_types?.length > 0)) {
            return null
        }
        return compactArray(this.cancel_types.map(x => CANCEL_TYPE_IDS[x]))
    }

    private tagListString(): string {
        return uniq(this.tag_list).join(", ")
    }

    private cancelTypesString(): string {
        return uniq(this.cancel_types).join(", ")
    }

    // =========================================================================
    // Public Methods
    // =========================================================================

    public slimData(): any {
        let data = {
            character_name: this?.character_name,
            alternate_name: this?.alternate_name,
            content:        this?.content,
            combo_type:     this?.combo_type,
            guard_type:     this?.guard_type,
            cancel_types:   this?.cancelTypesString(),
            tag_list:       this?.tagListString(),
            // Damage Data
            damage:      this.damage_data?.damage,
            chip_damage: this.damage_data?.chip_damage,
            stun:        this.damage_data?.stun_damage,
            // Frame Data
            startup:                 this.frame_data?.startup_frames,
            active:                  this.frame_data?.active_frames,
            recovery:                this.frame_data?.whiff_recovery_frames,
            block_advantage:         this.frame_data?.block_frame_advantage,
            hit_advantage:           this.frame_data?.hit_frame_advantage,
            crouching_hit_advantage: this.frame_data?.crouching_hit_frame_advantage,
            // Meter Data
            meter_cost: this.meter_data?.meter_cost,
        }
        return compactObject(data)
    }

    public thickData(): any {

        let result: any = {}

        result._1_1_character_name = this.character_name

        if (this.tag_list?.length > 0) { result._1_2_1_tag_list = this.tagListString() }
        result._1_2_2_cancel_types   = this.cancel_types?.toString()
        result._1_2_3_guard_type     = this.guard_type

        result._1_3_1_description    = this?.description
        result._1_3_2_official_name  = this?.official_name
        result._1_3_3_sort_order     = this?.sort_order
        result._1_3_4_combo_type     = this.combo_type
        result._1_3_5_content        = this?.content
        result._1_3_6_alternate_name = this?.alternate_name

        if (!isEmpty(this.damage_data)) { (result._2_damage_data = this.damage_data.thickData())   }
        if (!isEmpty(this.frame_data))  { (result._3_frame_data  = this.frame_data.thickData())    }
        if (!isEmpty(this.meter_data))  { (result._4_meter_data  = this.meter_data.thickData())    }
        if (!isEmpty(this.metadata))    { (result._9_metadata    = JSON.stringify(this.metadata))  }

        return compactObject(result)
    }

    public toJSON(): Partial<Combo> {
        let result: Partial<Combo> = {}

        result.confirmed = false
        result.which_notation_style = "Dynamic"
        // result.character_name = this.character_name

        result.game_character_id = this.getGameCharacterId(characterIds)
        result.combo_type_id     = this.getComboTypeId()
        result.guard_type_id     = this.getGuardTypeId()
        result.cancel_type_ids   = this.getCancelTypeIds()
        if (this.tag_list?.length > 0) { result.tag_list = this.tag_list }

        result.official_name  = this?.official_name
        result.alternate_name = this?.alternate_name
        result.description    = this?.description
        result.sort_order     = this?.sort_order
        result.content        = this?.content
        result.conditions     = this?.conditions
        result.hits           = this?.hits

        if (!isEmpty(this.metadata)) { (result.metadata = this.metadata) }

        if (!isEmpty(this.damage_data)) { (result.damage_data_v2 = compactObject(this.damage_data.toV2().toJSON())) }
        if (!isEmpty(this.frame_data))  { (result.frame_data_v2  = compactObject(this.frame_data.toV2().toJSON()))  }
        if (!isEmpty(this.meter_data))  { (result.meter_data_v2  = compactObject(this.meter_data.toV2().toJSON()))  }

        return compactObject(result)
    }

    public static fromJSON(data: any): Combo {
        let combo = new Combo()

        combo.metadata = JSON.parse(data["metadata"])

        combo.character_name = data["character_name"]
        combo.tag_list = data["tag_list"]?.split(/,\s*/)
        combo.cancel_types = data["cancel_types"]?.split(/,\s*/)
        combo.guard_type = data["guard_type"]
        combo.description = data["description"]
        combo.official_name = data["official_name"]
        combo.sort_order = data["sort_order"]
        combo.combo_type = data["combo_type"]
        combo.content = data["content"]
        combo.alternate_name = data["alternate_name"]

        combo.conditions = data["conditions"]
        combo.hits = data["hits"]

        combo.damage_data.damage = data["damage"]
        combo.damage_data.damage_formula = data["damage_formula"]
        combo.damage_data.chip_damage = data["chip_damage"]
        combo.damage_data.chip_damage_formula = data["chip_damage_formula"]
        combo.damage_data.stun_damage = data["stun_damage"]
        combo.damage_data.stun_damage_formula = data["stun_damage_formula"]
        combo.damage_data.life_point_damage = data["life_point_damage"]

        combo.frame_data.startup_frames = data["startup"]
        combo.frame_data.startup_frames_formula = data["startup_formula"]
        combo.frame_data.active_frames = data["active"]
        combo.frame_data.active_frames_formula = data["active_formula"]
        combo.frame_data.whiff_recovery_frames = data["whiff_recovery"]
        combo.frame_data.whiff_recovery_frames_formula = data["whiff_recovery_formula"]
        combo.frame_data.hit_frame_advantage = data["hit_advantage"]
        combo.frame_data.hit_frame_advantage_formula = data["hit_advantage_formula"]
        combo.frame_data.block_frame_advantage = data["block_advantage"]
        combo.frame_data.block_frame_advantage_formula = data["block_advantage_formula"]
        combo.frame_data.crouching_hit_frame_advantage = data["crouching_hit_advantage"]
        combo.frame_data.crouching_hit_frame_advantage_formula = data["crouching_hit_advantage_formula"]
        combo.frame_data.active_until_landing = data["active_until_landing"]
        combo.frame_data.recovery_until_landing = data["recovery_until_landing"]

        combo.meter_data.meter_cost = data["meter_cost"]
        combo.meter_data.meter_cost_formula = data["meter_cost_formula"]
        combo.meter_data.whiff_meter_build = data["whiff_meter_build"]
        combo.meter_data.whiff_meter_build_formula = data["whiff_meter_build_formula"]
        combo.meter_data.block_meter_build = data["block_meter_build"]
        combo.meter_data.block_meter_build_formula = data["block_meter_build_formula"]
        combo.meter_data.hit_meter_build = data["hit_meter_build"]
        combo.meter_data.hit_meter_build_formula = data["hit_meter_build_formula"]
        combo.meter_data.parry_meter_build = data["parry_meter_build"]
        combo.meter_data.parry_meter_build_formula = data["parry_meter_build_formula"]

        return combo
    }
}
