import { collectAllDataTSV, collectAllDataJSON, fromTSV, fromTsvToCombo } from "./srk"

async function main() {
    // await collectAllDataTSV()
    // await collectAllDataJSON()
    // await fromTSV()
    await fromTsvToCombo("Remy")
}

(async () => {
    await main()
    process.exit(0)
})()
