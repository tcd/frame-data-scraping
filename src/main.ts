import { collectKeys, parse3SFrameDataV2 } from "./srk"

async function main() {
    await collectKeys()
}

(async () => {
    await main()
    process.exit(0)
})()
