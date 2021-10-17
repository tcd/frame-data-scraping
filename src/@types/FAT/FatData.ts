import { characters } from "@data"
import { IThirdStrikeFrameData } from "@types"
import { uniq } from "lodash"

export interface IFatData {
    [characterName: string]: {
        moves: {
            normal: {
                [moveName: string]: IThirdStrikeFrameData
            }
        }
    }
}

export class FatData {

    public jsonData: IFatData

    constructor(jsonData: any) {
        this.jsonData = jsonData
    }

    public eachCharacter(func: Function) {
        characters.forEach(character => {
            let c = this.jsonData[character]
            let moves = c["moves"]["normal"]
            func(moves)
        })
    }

    public normalize() {
        let normalData = {}
        characters.forEach(characterName => {
            let cleanMoves = []
            let moves = this.jsonData[characterName]["moves"]["normal"]
            for (const moveName in moves) {
                let moveData = moves[moveName]
                cleanMoves.push(moveData)
            }
            normalData[characterName] = cleanMoves
        })
        return normalData
    }

    // public collectKeys() {
    //     let keys = {}
    //     characters.forEach(characterName => {
    //         let moves = this.jsonData[characterName]["moves"]["normal"]
    //         for (const moveName in moves) {
    //             let moveData = moves[moveName]
    //             for (const key in moveData) {
    //                 let value = moveData[key]
    //                 keys[key] = value
    //             }
    //         }
    //     })
    //     return keys
    // }

    public collectMoveTypes() {
        let moveTypes = []
        characters.forEach(characterName => {
            let moves = this.jsonData[characterName]["moves"]["normal"]
            for (const moveName in moves) {
                moveTypes.push(moves[moveName]["moveType"])
            }
        })
        return uniq(moveTypes)
    }
}
