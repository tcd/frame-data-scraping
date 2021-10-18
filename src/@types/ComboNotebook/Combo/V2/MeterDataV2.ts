import { compactObject } from "@lib"

import { ComboDataComponent } from "./ComboDataComponent"

export class MeterDataV2 {
    public meter_cost?: ComboDataComponent

    /** The amount of meter **you** gain when this move misses. */
    public whiff_meter_build?: ComboDataComponent

    /** The amount of meter **you** gain when this move is blocked. */
    public block_meter_build?: ComboDataComponent

    /** The amount of meter **you** gain when this move connects. */
    public hit_meter_build?: ComboDataComponent

    /** In Street Fighter 3: Third Strike, how much super gauge **your opponent** builds by parrying this move. */
    public parry_meter_build?: ComboDataComponent

    constructor() {
        this.meter_cost        = {}
        this.whiff_meter_build = {}
        this.block_meter_build = {}
        this.hit_meter_build   = {}
        this.parry_meter_build = {}
    }

    // =========================================================================
    // Methods
    // =========================================================================

    public toJSON(): Partial<MeterDataV2> {
        let result: Partial<MeterDataV2> = {
            meter_cost:        compactObject(this.meter_cost),
            whiff_meter_build: compactObject(this.whiff_meter_build),
            block_meter_build: compactObject(this.block_meter_build),
            hit_meter_build:   compactObject(this.hit_meter_build),
            parry_meter_build: compactObject(this.parry_meter_build),
        }
        return compactObject(result)
    }
}
