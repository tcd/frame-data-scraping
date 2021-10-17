// Move
// Motion
// Damage
// Stun Damage
// Chains into itself
// Special Cancel
// Super Cancel
// Juggle Value
// Startup
// Hit
// Recovery
// Blocked Advantage
// Hit Advantage
// Crouching Hit Advantage
// Guard
// Parry
// Miss
// Blocked
// Hit
// Parry (Gauge for opponent)
export interface NewSrkData {
    startup_frames?: string                // Startup
    active_frames?: string                 // Active
    whiff_recovery_frames?: string         // Recovery
    hit_frame_advantage?: string           // Hit
    crouching_hit_frame_advantage?: string // Cr. Hit
    damage?: string                        // Damage
    stun_damage?: string                   // Stun
    guard_type?: string                    // Attack
    parry?: string                         // Parry
    block_frame_advantage?: string         // Block
}

