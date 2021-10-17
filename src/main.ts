import { collectAllDataTSV, collectAllDataJSON, fromTSV, fromTsvToCombo } from "./srk"
// import { main } from "./fat"

async function main() {
    // await collectAllDataTSV()
    // await collectAllDataJSON()
    // await fromTSV()
    await fromTsvToCombo("Sean")
}

(async () => {
    await main()
    process.exit(0)
})()
