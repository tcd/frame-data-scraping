import { compactObject } from "@lib"

import { FrameData } from "./FrameData"
import { DamageData } from "./DamageData"
import { MeterData } from "./MeterData"

export class Combo {

    constructor() { }

    public metadata?: any
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
    public hit_count?: string // (read only)

    public damage_data?: DamageData
    public meter_data?: MeterData
    public frame_data?: FrameData

    // =========================================================================
    // New for scraping
    // =========================================================================
    public character_name?: string
    public combo_type?: string
    public guard_type?: string
    public cancel_types?: string
    public tag_list?: string

    public slimData(): any {
        let data = {
            character_name: this?.character_name,
            alternate_name: this?.alternate_name,
            content:        this?.content,
            combo_type:     this?.combo_type,
            guard_type:     this?.guard_type,
            cancel_types:   this?.cancel_types,
            tag_list:       this?.tag_list,
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
}
