// src/types/redux-saga.d.ts
declare module 'redux-saga/effects' {
    export function all(effects: any[]): any;
    export function takeLatest(pattern: any, saga: any): any;
    export function put(action: any): any;
    export function call(fn: any, ...args: any[]): any;
    export function select(selector?: (state: any) => any): any;
}

declare module 'redux-saga' {
    export default function* sagaMiddleware(): any;
}