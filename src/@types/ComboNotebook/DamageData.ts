export class DamageData {
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
}
