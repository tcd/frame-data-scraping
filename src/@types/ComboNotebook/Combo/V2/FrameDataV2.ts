import { compactObject } from "@lib"

import { ComboDataComponent } from "./ComboDataComponent"

export class FrameDataV2 {
    /**
     * The period of time that occurs after pressing your attack button, but before your attack is capable of making contact with the opponent.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Startup) for a more thorough explanation.
     */
    public startup?: ComboDataComponent

    /**
     * The period of time that a move has a hitbox and is capable of doing damage to the opponent.
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Active) for a more thorough explanation.
     */
    public active?: ComboDataComponent

    /**
     * When attack neither hits nor is blocked, this is the period of time that occurs before you gain back control of your character for more actions.
     *
     * See [The Fighting Game Glossary - Recovery](https://glossary.infil.net/?t=Recovery).
     *
     * See [The Fighting Game Glossary - Whiff](https://glossary.infil.net/?t=Whiff).
     */
    public recovery?: ComboDataComponent

    /**
     * Additional recovery frames for jumping attacks after your character lands.
     */
    public landing_recovery?: ComboDataComponent

    /**
     * Describes who recovers first when a move hits.
     */
    public hit_advantage?: ComboDataComponent

    /**
     * Describes who recovers first when a move hits as a counter hit.
     */
    public counter_hit_advantage?: ComboDataComponent

    /**
     * Describes who recovers first when a move is blocked.
     */
    public block_advantage?: ComboDataComponent

    public active_until_landing?: boolean
    public recovery_until_landing?: boolean

    /**
     * Only applies to Mortal Kombat.
     * Not sure exactly what this means.
     */
    public cancel?: number

    /**
        * Only applies to Street Fighter 3: Third Strike.
        */
    public crouching_hit_advantage?: ComboDataComponent

    // =========================================================================
    // Methods
    // =========================================================================

    public toJSON(): Partial<FrameDataV2> {
        let result: Partial<FrameDataV2> = {
            active_until_landing:    this.active_until_landing,
            recovery_until_landing:  this.recovery_until_landing,
            startup:                 compactObject(this.startup),
            active:                  compactObject(this.active),
            recovery:                compactObject(this.recovery),
            landing_recovery:        compactObject(this.landing_recovery),
            hit_advantage:           compactObject(this.hit_advantage),
            counter_hit_advantage:   compactObject(this.counter_hit_advantage),
            block_advantage:         compactObject(this.block_advantage),
            crouching_hit_advantage: compactObject(this.crouching_hit_advantage),
        }
        return compactObject(result)
    }
}
