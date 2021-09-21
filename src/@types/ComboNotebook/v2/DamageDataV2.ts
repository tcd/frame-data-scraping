import { compactObject } from "@lib"

import { ComboDataComponent } from "./ComboDataComponent"

export class DamageDataV2 {
    /**
     * Damage dealt to another character.
     */
    public damage?: ComboDataComponent
    /**
     * Damage dealt to a character while they are blocking.
     */
    public chip_damage?: ComboDataComponent
    /**
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Stun).
     */
    public stun_damage?: ComboDataComponent

    public self_damage?: ComboDataComponent
    public self_stun_damage?: ComboDataComponent

    public recovered_health?: ComboDataComponent
    /**
     * Only applies to Street Fighter 3: Third Strike.
     */
    public life_point_damage?: number

    // =========================================================================
    // Methods
    // =========================================================================

    public toJSON(): Partial<DamageDataV2> {
        let result: Partial<DamageDataV2> = {
            life_point_damage: this.life_point_damage,
            damage:            compactObject(this.damage),
            chip_damage:       compactObject(this.chip_damage),
            stun_damage:       compactObject(this.stun_damage),
            self_damage:       compactObject(this.self_damage),
            self_stun_damage:  compactObject(this.self_stun_damage),
            recovered_health:  compactObject(this.recovered_health),
        }
        return compactObject(result)
    }
}
