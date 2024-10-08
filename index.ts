const cjkCharPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
const euCharPattern  = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+/g
const grCharPattern  = /\p{Script=Greek}+/gu
const arCharPattern  = /\p{Script=Arabic}+/gu
const cyCharPattern  = /\p{Script=Cyrillic}+/gu
const numberPattern  = /(\-|\+)?\d+(\.\d+)?/g

const patternList: RegExp[] = [
    cjkCharPattern,
    euCharPattern,
    grCharPattern,
    arCharPattern,
    cyCharPattern,
    numberPattern,
]

function preprocessStringParams(param: any): string {
    const paramType = typeof param
    if (paramType === "string") {
        return param
    } else if (paramType === "number") {
        return String(param)
    }

    throw new TypeError("Expected a string, got " + typeof param)
}

export function tokenize(para: string): string[] {
    para = preprocessStringParams(para)
    if (para.length === 0) {
        return []
    }

    const tokenList = patternList
        .map(pattern => para.match(pattern) || [])
        .reduce((accumulator: string[], current: string[]) =>
            accumulator.concat(current)
        , [])

    return tokenList
}

const DEFAULT_READ_SPEED_PER_MIN = 300
export type ReadingRate = number | {
    cjk?: number,
    eu?: number,
    gr?: number,
    ar?: number,
    cy?: number,
    num?: number,
    default?: number,
}
export function readingTime(
    para: string,
    wordsPerMin: ReadingRate=DEFAULT_READ_SPEED_PER_MIN,
): number {
    para = preprocessStringParams(para)
    if (para.length === 0) {
        return 0
    }

    const compute = (() => {
        if (typeof wordsPerMin === "number") {
            return function(wordCount: number, pattern: RegExp): number {
                return wordCount / wordsPerMin
            }
        } else if (typeof wordsPerMin !== "object") {
            // unexpected input type
            throw new TypeError("Expected a string or an object, got " + typeof wordsPerMin)
        }

        if (wordsPerMin.default === undefined) {
            // set default value
            wordsPerMin.default = DEFAULT_READ_SPEED_PER_MIN
        }
        const patternMap = new Map<RegExp, number | undefined>([
            [cjkCharPattern, wordsPerMin.cjk],
            [euCharPattern , wordsPerMin.eu ],
            [grCharPattern , wordsPerMin.gr ],
            [arCharPattern , wordsPerMin.ar ],
            [cyCharPattern , wordsPerMin.cy ],
            [numberPattern , wordsPerMin.num],
        ])
        return function(wordCount: number, pattern: RegExp): number {
            const targetSpeed = patternMap.get(pattern)
            return targetSpeed === undefined ?
                wordCount / wordsPerMin.default! :
                wordCount / targetSpeed
        }
    })()

    const requiredTime = patternList.reduce((accumulator: number, current: RegExp) => {
        const matched = para.match(current) || []
        return accumulator + compute(matched.length, current)
    }, 0)
    return requiredTime
}

export function countWords(para: string): number {
    para = preprocessStringParams(para)
    if (para.length === 0) {
        return 0
    }

    const tokenList = tokenize(para)
    return tokenList.length
}
