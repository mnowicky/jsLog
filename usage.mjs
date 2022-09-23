import { log, access, warn, debug, system, db, event, info, error, fatal, readLog } from './logga.mjs'
//example usages
log({level: 'system', message: 'this is a system message'});
log({level: 'access', message: 'i have been accessed via auth-en-tic-a-shon'});
log({level: 'warn', message: 'WARNING WARNING WARNING'});
log({level: 'debug', message: 'debug me'});
log({level: 'error', message: 'ERR-ORRR!'});
log({level: 'db', message: 'hi i am a database'});
log({level: 'event', message: 'events!!'});
log({level: 'info', message: 'some information'});
log({level: 'fatal', message: 'this is a fatal errrrrorrr!!!'});

const issue = new Error()
issue.message = "There was an error"

log({level: 'error', error: issue})
log({level: 'fatal', error: issue})
error(issue)
fatal(issue)
log({level: 'event', message: ' this is an event!!'})
db('this is a database issue!!')
fatal('this is a FATAL error')
info('this is an info message')
debug('this is a debug issue')
access('this is a access issue')
warn('this is a warning')
system('system down!!')
event('i am throwing an event! Tuesday!')


readLog('info.log').then(result => {
    console.log(result)
})
