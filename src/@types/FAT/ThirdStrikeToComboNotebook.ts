import { Combo, IThirdStrikeFrameData } from "@types"

export const ThirdStrikeToComboNotebook = (fatData: IThirdStrikeFrameData): Combo => {
    let combo = new Combo()
    return combo
}

const moveTypes = [
    "normal",
    "throw",
    "universal-oh",
    "taunt",
    "special",
    "movement-special",
    "super",
    "command-grab",
]

const moveTypesMap = {
    "normal": "",
    "throw": "",
    "universal-oh": "",
    "taunt": "",
    "special": "",
    "movement-special": "",
    "super": "",
    "command-grab": "",
}
