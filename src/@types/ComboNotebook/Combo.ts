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
    public combo_type?: string
    public guard_type?: string
    public cancel_types?: string
    public tag_list?: string
}
