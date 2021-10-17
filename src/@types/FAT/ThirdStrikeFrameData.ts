export interface ThirdStrikeFrameData {
    moveName:      string
    plnCmd:        string
    numCmd:        string
    startup:       number
    active:        number
    recovery:      number
    onHit:         number
    onBlock:       number
    onHitCrouch:   number
    moveType:      string
    cancelsTo:     string[]
    parry:         string
    karaRange:     number
    damage:        number
    stun:          number
    meterAtkWhiff: number
    meterAtkHit:   number
    meterAtkBlk:   number
    meterOppHit:   number
    meterOppBlk:   number
    moveMotion:    string
    moveButton:    string
    extraInfo:     string[]
}
