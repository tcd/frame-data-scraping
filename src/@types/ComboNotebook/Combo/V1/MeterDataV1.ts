import { compactObject } from "@lib"

import { MeterDataV2 } from "../V2"

export class MeterDataV1 {
    public meter_cost?: number
    public min_meter_cost?: number
    public max_meter_cost?: number
    public meter_cost_formula?: string

    /** The amount of meter **you** gain when this move misses. */
    public whiff_meter_build?: number
    /** The amount of meter **you** gain when this move misses. */
    public whiff_meter_build_formula?: string

    /** The amount of meter **you** gain when this move is blocked. */
    public block_meter_build?: number
    /** The amount of meter **you** gain when this move is blocked. */
    public block_meter_build_formula?: string

    /** The amount of meter **you** gain when this move connects. */
    public hit_meter_build?: number
    /** The amount of meter **you** gain when this move connects. */
    public hit_meter_build_formula?: string

    /** In Street Fighter 3: Third Strike, how much super gauge **your opponent** builds by parrying this move. */
    public parry_meter_build?: number
    /** In Street Fighter 3: Third Strike, how much super gauge **your opponent** builds by parrying this move. */
    public parry_meter_build_formula?: string

    public thickData(): any {
        let result = {
            _4_1_meter_cost:         this.meter_cost,
            _4_1_min_meter_cost:     this.min_meter_cost,
            _4_1_max_meter_cost:     this.max_meter_cost,
            _4_1_meter_cost_formula: this.hit_meter_build_formula,

            _4_2_whiff_meter_build:         this.whiff_meter_build,
            _4_2_whiff_meter_build_formula: this.whiff_meter_build_formula,

            _4_3_block_meter_build:         this.block_meter_build,
            _4_3_block_meter_build_formula: this.block_meter_build_formula,

            _4_4_hit_meter_build:         this.hit_meter_build,
            _4_4_hit_meter_build_formula: this.hit_meter_build_formula,

            _4_5_parry_meter_build:         this.parry_meter_build,
            _4_5_parry_meter_build_formula: this.parry_meter_build_formula,
        }
        return compactObject(result)
    }

    public toJSON(): Partial<MeterDataV1> {
        let result: Partial<MeterDataV1> = {
            meter_cost:         this.meter_cost,
            min_meter_cost:     this.min_meter_cost,
            max_meter_cost:     this.max_meter_cost,
            meter_cost_formula: this.hit_meter_build_formula,

            whiff_meter_build:         this.whiff_meter_build,
            whiff_meter_build_formula: this.whiff_meter_build_formula,

            block_meter_build:         this.block_meter_build,
            block_meter_build_formula: this.block_meter_build_formula,

            hit_meter_build:         this.hit_meter_build,
            hit_meter_build_formula: this.hit_meter_build_formula,

            parry_meter_build:         this.parry_meter_build,
            parry_meter_build_formula: this.parry_meter_build_formula,
        }
        return compactObject(result)
    }

    public toV2(): MeterDataV2 {
        let result = new MeterDataV2()

        result.meter_cost = {
            numeric_value: this.meter_cost,
            min:           this.min_meter_cost,
            max:           this.max_meter_cost,
            formula:       this.hit_meter_build_formula,
        }

        result.whiff_meter_build = {
            numeric_value: this.whiff_meter_build,
            formula:       this.whiff_meter_build_formula,
        }

        result.block_meter_build = {
            numeric_value: this.block_meter_build,
            formula:       this.block_meter_build_formula,
        }

        result.hit_meter_build = {
            numeric_value: this.hit_meter_build,
            formula:       this.hit_meter_build_formula,
        }

        result.parry_meter_build = {
            numeric_value: this.parry_meter_build,
            formula:       this.parry_meter_build_formula,
        }

        return result
    }
}
