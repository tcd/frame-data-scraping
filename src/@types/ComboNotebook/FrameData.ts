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
}
