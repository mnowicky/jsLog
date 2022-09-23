import path from 'path'
import chalk from 'chalk'
import moment from 'moment'
import {existsSync, mkdirSync, appendFileSync, createReadStream} from 'fs'
import readline from 'readline'
import config from './config.mjs'

/**
 * Main logging function
 * @param {object} options 
 */
export const log = (options) => {
    const levelName = getLevelName(options.level)
    let message = options.message ?? 'Unidentified Error'
    const error = options.error ?? null 

    //log to console
    writeToConsole(levelName, message, error)

    if(config.levels[levelName].writeToFile){
        writeToFile(levelName, message)
    }
}

/**
 * Write formatted message to console
 * @param {string} levelName 
 * @param {string} message 
 * @param {Error|null} error 
 */
const writeToConsole = (levelName, message, error = null) => {
    const level = config.levels[levelName]
    let chalkFunction = null

    if(level.color.includes('#')){
        chalkFunction = chalk.hex(level.color)
    } else if (Array.isArray(level.color)){
        if(level.color.length === 3){
            chalkFunction = chalk.rgb(level.color[0], level.color[1], level.color[2])
        } else {
            throw new Error(
                `Mis-configuration detected: log level ${chalk.red(`[${levelName.toUpperCase()}]`)} 
                is set to RGB but only has ${chalk.red(`${level.color.length}`)}
                values.\nThe Configuration must be an ${chalk.red('array')}
                and contain ${chalk.red('3')} values.`
            )
        }
    } else {
        chalkFunction = chalk[level.color]
    }

    message = error ? `${chalkFunction(`${error.message} \n ${error.stack}`)}` : message
    const header = `[${levelName.toUpperCase()}] [${getCurrentDate()}]`

    console.log(`${chalkFunction(header)}: ${chalkFunction(message)}`)
}

/**
 * Write formatted message to file
 * @param {string} levelName 
 * @param {string} message 
 */
const writeToFile = (level, message) => {
    const logsDir = './logs'
    const data = `{"level": "${level.toUpperCase()}", "message": "${message}", "timestamp": "${getCurrentDate()}"}\r\n`

    if(!existsSync(logsDir)){
        mkdirSync(logsDir)
    }

    const options = {
        encoding: 'utf8',
        mode: 438
    }

    appendFileSync(`./logs/${level}.log`, data, options)
}

/**
 * Read data from a log
 * @param {string} fileName
 * @returns Promise 
 */
export const readLog = async (fileName = null) => {
    const logsDir = './logs'
    return new Promise((resolve, reject) => {
        const file = path.join(
            logsDir, 
            fileName.includes('.') ? fileName : `${fileName}.log`
        )

        const lineReader = readline.createInterface({
            input: createReadStream(file)
        })

        const logs = []

        lineReader.on('line', (line) => {
            logs.push(JSON.parse(line))
        })

        lineReader.on('close', () => {
            console.log(
                chalk.yellow(`${fileName.toUpperCase} logs have been accessed.`)
            )
            console.table(logs)
            resolve(logs)
        })

        lineReader.on('error', (error) => {
            reject(error)
        })
    })
}

/**
 * get level name
 * @param {string} level 
 * @returns 
 */
const getLevelName = (level) => {
    return level && config.levels.hasOwnProperty(level) ? level : 'info'
}

/**
 * returns date
 * @returns string
 */
const getCurrentDate = () => {
    return moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
}

/**
 * helper functions
 * @param {string} message 
 */
export const access = (message) => {
    log({level: 'access', message})
}
export const warn = (message) => {
    log({level: 'warn', message})
}
export const system = (message) => {
    log({level: 'system', message})
}
export const info = (message) => {
    log({level: 'info', message})
}
export const event = (message) => {
    log({level: 'event', message})
}
export const db = (message) => {
    log({level: 'db', message})
}
export const debug = (message) => {
    log({level: 'debug', message})
}
/**
 * @param {String | Error} message 
 */
export const error = (error) => {
    if(typeof error === 'string'){
        log({level: 'error', message: error})
    } else {
        log({level: 'error', error})
    }
}
export const fatal = (error) => {
    if(typeof error === 'string'){
        log({level: 'fatal', message: error})
    } else {
        log({level: 'fatal', error})
    }
}