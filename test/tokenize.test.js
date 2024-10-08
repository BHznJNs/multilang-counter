import assert from "node:assert"
import { tokenize } from "../dist/index.esm.js"

describe("tokenize", () => {
    it("should be a function", () => {
        assert.ok(tokenize instanceof Function)
    })
    it("should accepts a string input and returns tokenized string array", () => {
        assert.deepStrictEqual(
            tokenize("Hello World"),
            ["Hello", "World"],
        )
    })
    it("should ignores punctuations in the input", () => {
        assert.deepStrictEqual(
            tokenize("Hello, World!"),
            ["Hello", "World"],
        )
    })
    describe("multiple language compatibility", () => {
        describe("CJK languages", () => {
            it("should tokenize Chinese text correctly and remove punctuation", () => {
                const chineseText = "你好，世界!"
                const expectedTokens = ["你", "好", "世", "界"]
                assert.deepStrictEqual(tokenize(chineseText), expectedTokens)
            })

            it("should tokenize Japanese text correctly and remove punctuation", () => {
                const japaneseText = "こんにちは、世界!"
                const expectedTokens = ["こ", "ん", "に", "ち", "は", "世", "界"]
                assert.deepStrictEqual(tokenize(japaneseText), expectedTokens)
            })

            it("should tokenize Korean text correctly and remove punctuation", () => {
                const koreanText = "안녕하세요, 세계!"
                const expectedTokens = ["안", "녕", "하", "세", "요", "세", "계"]
                assert.deepStrictEqual(tokenize(koreanText), expectedTokens)
            })
        })
        describe("Other languages", () => {
            it("should tokenize English text correctly and remove punctuation", () => {
                const englishText = "Hello, world!"
                const expectedTokens = ["Hello", "world"]
                assert.deepStrictEqual(tokenize(englishText), expectedTokens)
            })

            it("should tokenize Greek text correctly and remove punctuation", () => {
                const greekText = "Γεια σου, κόσμε!" // Hello world in Greek
                const expectedTokens = ["Γεια", "σου", "κόσμε"]
                assert.deepStrictEqual(tokenize(greekText), expectedTokens)
            })

            it("should tokenize Arabic text correctly and remove punctuation", () => {
                const arabicText = "مرحبا، بالعالم!" // Hello world in Arabic
                const expectedTokens = ["مرحبا", "بالعالم"]
                assert.deepStrictEqual(tokenize(arabicText), expectedTokens)
            })

            it("should tokenize Cyrillic (Russian) text correctly and remove punctuation", () => {
                const russianText = "Привет, мир!" // Hello world in Russian
                const expectedTokens = ["Привет", "мир"]
                assert.deepStrictEqual(tokenize(russianText), expectedTokens)
            })
        })
    })
    describe("resolve for different type of input", () => {
        it("should works well with number input", () => {
            assert.deepStrictEqual(tokenize(123) , ["123" ])
            assert.deepStrictEqual(tokenize(-123), ["-123"])
            assert.deepStrictEqual(tokenize(1.23), ["1.23"])
        })
        it("should reject all input other that string and number typed", () => {
            const inputArr = [undefined, null, true, false, Symbol(""), {}, new Function]
            for (const input of inputArr) {
                assert.throws(() => tokenize(input), {
                    name: "TypeError",
                    message: "Expected a string, got " + typeof input
                })
            }
        })
    })
})
