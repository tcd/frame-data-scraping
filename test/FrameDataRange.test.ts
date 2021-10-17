import * as assert from "assert"

import { parseFrameDataRange } from "@types"

describe("parseFrameDataRange()", function () {
    it("should return the string 'something'", function () {
        let result = parseFrameDataRange("69")
        assert.equal("something", result)
    })
})
