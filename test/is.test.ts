import { assert } from "chai"

import { isString, isObject } from "@lib"

describe("isString()", function () {
    it("should return false for null", function () {
        assert.equal(false, isString(null))
    })
    it("should return false for undefined", function () {
        assert.equal(false, isString(undefined))
    })
    it("should return false for a number", function () {
        assert.equal(false, isString(69))
    })
    it("should return false for a boolean", function () {
        assert.equal(false, isString(true))
        assert.equal(false, isString(false))
    })
    it("should return false for an object", function () {
        assert.equal(false, isString({ value: "string" }))
    })
    it("should return false for an array", function () {
        assert.equal(false, isString(["string"]))
    })
    it("should return true for a string", function () {
        assert.equal(true, isString("string"))
    })
})

describe("isObject()", function () {
    it("should return false for null", function () {
        assert.equal(false, isObject(null))
    })
    it("should return false for undefined", function () {
        assert.equal(false, isObject(undefined))
    })
    it("should return false for a number", function () {
        assert.equal(false, isObject(69))
    })
    it("should return false for a boolean", function () {
        assert.equal(false, isObject(true))
        assert.equal(false, isObject(false))
    })
    it("should return false for an array", function () {
        assert.equal(false, isObject(["string"]))
    })
    it("should return false for a string", function () {
        assert.equal(false, isObject("string"))
    })
    it("should return true for an object", function () {
        assert.equal(true, isObject({}))
        assert.equal(true, isObject({ value: "string" }))
    })
    it("should return true for an object property", function () {
        let myObject = {
            something: "something else"
        }
        assert.equal(true, isObject(myObject))
    })
    it("should return true for a class property", function () {
        class MyClass {
            public myObject

            constructor() {
                this.myObject = {}
            }
        }
        let myInstance = new MyClass()
        assert.equal(true, isObject(myInstance))
    })
})
