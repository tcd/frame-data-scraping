import { compactObject } from "@lib"

import { DamageDataV2 } from "../v2"

export class DamageDataV1 {
    public damage?: number
    public damage_formula?: string
    public min_damage?: number
    public max_damage?: number
    /**
     * Damage dealt to a character while they are blocking.
     */
    public chip_damage?: number
    public chip_damage_formula?: string
    /**
     * See [The Fighting Game Glossary](https://glossary.infil.net/?t=Stun).
     */
    public stun_damage?: number
    public stun_damage_formula?: string
    /**
     * I think this only applies to Street Fighter 3: Third Strike.
     */
    public life_point_damage?: number
    /**
     * I think this only applies to Street Fighter 3: Third Strike.
     */
    public life_point_chip_damage?: number

    public self_damage?: number
    public self_stun_damage?: number

    public recovered_health?: number

    public thickData() {
        let result = {
            _2_1_damage:         this.damage,
            _2_1_min_damage:     this.min_damage,
            _2_1_max_damage:     this.max_damage,
            _2_1_damage_formula: this.damage_formula,

            _2_2_chip_damage:         this.chip_damage,
            _2_2_chip_damage_formula: this.chip_damage_formula,

            _2_3_stun_damage:         this.stun_damage,
            _2_3_stun_damage_formula: this.stun_damage_formula,

            _2_4_life_point_damage:      this.life_point_damage,
            _2_4_life_point_chip_damage: this.life_point_chip_damage,

            _2_5_self_damage:      this.self_damage,
            _2_5_self_stun_damage: this.self_stun_damage,

            _2_6_recovered_health: this.recovered_health,
        }
        return compactObject(result)
    }

    public toJSON(): Partial<DamageDataV1> {
        let result: Partial<DamageDataV1> = {
            damage:         this.damage,
            min_damage:     this.min_damage,
            max_damage:     this.max_damage,
            damage_formula: this.damage_formula,

            chip_damage:         this.chip_damage,
            chip_damage_formula: this.chip_damage_formula,

            stun_damage:         this.stun_damage,
            stun_damage_formula: this.stun_damage_formula,

            life_point_damage:      this.life_point_damage,
            life_point_chip_damage: this.life_point_chip_damage,

            self_damage:      this.self_damage,
            self_stun_damage: this.self_stun_damage,

            recovered_health: this.recovered_health,
        }
        return compactObject(result)
    }

    public toV2(): DamageDataV2 {
        let result = new DamageDataV2()

        result.life_point_damage = this.life_point_damage,

        result.damage = {
            numeric_value: this.damage,
            min:           this.min_damage,
            max:           this.max_damage,
            formula:       this.damage_formula,
        }

        result.chip_damage = {
            numeric_value: this.chip_damage,
            formula:       this.chip_damage_formula,
        }

        result.stun_damage = {
            numeric_value: this.stun_damage,
            formula:       this.stun_damage_formula,
        }

        result.self_damage = {
            numeric_value: this.self_damage,
        }

        result.self_stun_damage = {
            numeric_value: this.self_stun_damage,
        }

        result.recovered_health = {
            numeric_value: this.recovered_health,
        }

        return result
    }
}
