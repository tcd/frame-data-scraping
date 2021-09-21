import { compactObject } from "@lib"

import { FrameDataV2 } from "./v2"

export class FrameData {
    /**
     * The period of time that occurs after pressing your attack button, but before your attack is capable of making contact with the opponent.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Startup) for a more thorough explanation.
     */
    public startup_frames?: number
    /**
     * The period of time that occurs after pressing your attack button, but before your attack is capable of making contact with the opponent.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Startup) for a more thorough explanation.
     */
    public startup_frames_formula?: string

    /**
     * The period of time that a move has a hitbox and is capable of doing damage to the opponent.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Active) for a more thorough explanation.
     */
    public active_frames?: number
    /**
     * The period of time that a move has a hitbox and is capable of doing damage to the opponent.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Active) for a more thorough explanation.
     */
    public active_frames_formula?: string

    /**
     * The period of time that occurs after your attack has finished hitting, but before you gain back control of your character for more actions.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Recovery) for a more thorough explanation.
     */
    public total_recovery_frames?: number
    public whiff_recovery_frames?: number
    public whiff_recovery_frames_formula?: string
    /**
     * Additional recovery frames for jumping attacks after your character lands.
     */
    public landing_recovery_frames?: number

    /**
     * @deprecated use `hit_frame_advantage` instead.
     */
    public hit_recovery_frames?: number
    /**
     * Describes who recovers first when a move hits.
     */
    public hit_frame_advantage?: number
    /**
     * Describes who recovers first when a move hits.
     */
    public hit_frame_advantage_formula?: string

    /**
     * @deprecated use `counter_hit_frame_advantage` instead.
     */
    public counter_hit_recovery_frames?: number
    /**
     * Describes who recovers first when a move hits as a counter hit.
     */
    public counter_hit_frame_advantage?: number
    /**
     * Describes who recovers first when a move hits as a counter hit.
     */
    public counter_hit_frame_advantage_formula?: string

    /**
     * @deprecated use `block_frame_advantage` instead.
     */
    public block_recovery_frames?: number
    /**
     * Describes who recovers first when a move is blocked.
     */
    public block_frame_advantage?: number
    /**
     * Describes who recovers first when a move is blocked.
     */
    public block_frame_advantage_formula?: string

    /**
     * I think this only applies to Mortal Kombat.
     * Not sure exactly what this means.
     */
    public cancel_frame_advantage?: number

    /**
     * I think this only applies to Street Fighter 3: Third Strike.
     */
    public crouching_hit_frame_advantage?: number

    /**
     * I think this only applies to Street Fighter 3: Third Strike.
     */
    public crouching_hit_frame_advantage_formula?: string

    public active_until_landing?: boolean
    public recovery_until_landing?: boolean

    public thickData(): any {
        let result = {
            _3_1_startup_frames:         this.startup_frames,
            _3_1_startup_frames_formula: this.startup_frames_formula,

            _3_2_active_frames:         this.active_frames,
            _3_2_active_frames_formula: this.active_frames_formula,

            _3_3_total_recovery_frames:         this.total_recovery_frames,
            _3_3_whiff_recovery_frames:         this.whiff_recovery_frames,
            _3_3_whiff_recovery_frames_formula: this.whiff_recovery_frames_formula,
            _3_3_landing_recovery_frames:       this.landing_recovery_frames,

            _3_4_hit_frame_advantage:         this.hit_frame_advantage,
            _3_4_hit_frame_advantage_formula: this.hit_frame_advantage_formula,

            _3_5_counter_hit_frame_advantage:         this.counter_hit_frame_advantage,
            _3_5_counter_hit_frame_advantage_formula: this.counter_hit_frame_advantage_formula,

            _3_6_block_frame_advantage:         this.block_frame_advantage,
            _3_6_block_frame_advantage_formula: this.block_frame_advantage_formula,

            _3_7_crouching_hit_frame_advantage:         this.crouching_hit_frame_advantage,
            _3_7_crouching_hit_frame_advantage_formula: this.crouching_hit_frame_advantage_formula,

            _3_8_active_until_landing:   this.active_until_landing,
            _3_8_recovery_until_landing: this.recovery_until_landing,
        }
        return compactObject(result)
    }

    public toJSON(): Partial<FrameData> {
        let result: Partial<FrameData> = {
            startup_frames:         this.startup_frames,
            startup_frames_formula: this.startup_frames_formula,

            active_frames:         this.active_frames,
            active_frames_formula: this.active_frames_formula,

            total_recovery_frames:         this.total_recovery_frames,
            whiff_recovery_frames:         this.whiff_recovery_frames,
            whiff_recovery_frames_formula: this.whiff_recovery_frames_formula,
            landing_recovery_frames:       this.landing_recovery_frames,

            hit_frame_advantage:         this.hit_frame_advantage,
            hit_frame_advantage_formula: this.hit_frame_advantage_formula,

            counter_hit_frame_advantage:         this.counter_hit_frame_advantage,
            counter_hit_frame_advantage_formula: this.counter_hit_frame_advantage_formula,

            block_frame_advantage:         this.block_frame_advantage,
            block_frame_advantage_formula: this.block_frame_advantage_formula,

            crouching_hit_frame_advantage:         this.crouching_hit_frame_advantage,
            crouching_hit_frame_advantage_formula: this.crouching_hit_frame_advantage_formula,

            active_until_landing:   this.active_until_landing,
            recovery_until_landing: this.recovery_until_landing,
        }
        return compactObject(result)
    }

    public toV2(): FrameDataV2 {
        let result = new FrameDataV2()

        result.active_until_landing =   this.active_until_landing
        result.recovery_until_landing = this.recovery_until_landing

        result.startup = {
            numeric_value: this.startup_frames,
            formula:       this.startup_frames_formula,
        }

        result.active = {
            numeric_value: this.active_frames,
            formula:       this.active_frames_formula,
        }

        // total_recovery_frames: this.total_recovery_frames,
        result.recovery = {
            numeric_value: this.whiff_recovery_frames,
            formula:       this.whiff_recovery_frames_formula,
        }

        result.landing_recovery = {
            numeric_value: this.landing_recovery_frames,
        }

        result.hit_advantage = {
            numeric_value: this.hit_frame_advantage,
            formula:       this.hit_frame_advantage_formula,
        }

        result.counter_hit_advantage = {
            numeric_value: this.counter_hit_frame_advantage,
            formula:       this.counter_hit_frame_advantage_formula,
        }

        result.block_advantage = {
            numeric_value: this.block_frame_advantage,
            formula:       this.block_frame_advantage_formula,
        }

        result.crouching_hit_advantage = {
            numeric_value: this.crouching_hit_frame_advantage,
            formula:       this.crouching_hit_frame_advantage_formula,
        }

        return result
    }
}
