import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

    public info(msg: string, ...obj: any[]): void {
        console.debug('[NetSec info] ' + msg, ...obj);
    }

    public debug(msg: string, ...obj: any[]): void {
        console.debug('[NetSec debug] ' + msg, ...obj);
    }

    public error(msg: string, ...obj: any[]): void {
        console.error('[NetSec error] ' + msg, ...obj);
    }
}