import { Combo, IThirdStrikeFrameData, COMBO_TYPES } from "@types"

export const ThirdStrikeToComboNotebook = (fatData: IThirdStrikeFrameData): Combo => {
    let combo = new Combo()

    combo.content = fatData?.numCmd

    combo.frame_data_v2.startup.numeric_value = fatData?.startup
    combo.frame_data_v2.active.numeric_value  = fatData?.active
    combo.frame_data_v2.recovery.numeric_value  = fatData?.recovery
    combo.frame_data_v2.hit_advantage.numeric_value  = fatData?.onHit
    // combo.frame_data_v2.crouching_hit_advantage.numeric_value  = fatData?.onHitCrouch

    return combo
}

const moveTypeToComboType = (moveType: string): string => {
    return (moveTypesMap[moveType] || null)
}

const moveTypesMap = {
    "normal":           COMBO_TYPES.NORMAL,
    "special":          COMBO_TYPES.SPECIAL,
    "movement-special": COMBO_TYPES.SPECIAL,
    "command-grab":     COMBO_TYPES.SPECIAL,
    "super":            COMBO_TYPES.SUPER,
    "throw":            COMBO_TYPES.UNIVERSAL_MECHANIC,
    "universal-oh":     COMBO_TYPES.UNIVERSAL_MECHANIC,
    "taunt":            COMBO_TYPES.UNIVERSAL_MECHANIC,
}
