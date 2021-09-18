import { collectAllDataTSV, collectAllDataJSON } from "./srk"

async function main() {
    await collectAllDataTSV()
    // await collectAllDataJSON()
}

(async () => {
    await main()
    process.exit(0)
})()
