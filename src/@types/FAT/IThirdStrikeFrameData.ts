export interface IThirdStrikeFrameData {
    moveName?:        string
    plnCmd?:          string
    numCmd?:          string
    cmdName?:         string
    cmnName?:         string
    moveType?:        string
    // Frame Data
    startup?:         number
    active?:          number
    recovery?:        number
    onHit?:           number
    onBlock?:         number
    onHitCrouch?:     string
    maxAdv?:          string
    // Damage Data
    damage?:          number
    stun?:            number
    // Meter Data
    meterAtkWhiff?:   number
    meterAtkHit?:     number
    meterAtkBlk?:     string
    meterOppHit?:     number
    meterOppBlk?:     string
    // Other
    throwRange?:      number
    karaRange?:       number
    cancelsTo?:       string[]
    attackLevel?:     string
    parry?:           string
    moveMotion?:      string
    moveButton?:      string
    chargeDirection?: string
    extraInfo?:       string[]
    airmove?:         boolean
    followUp?:        boolean
    nonHittingMove?:  boolean
    projectile?:      boolean
    antiAirMove?:     boolean
}
