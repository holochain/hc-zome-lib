import { Config } from '@holochain/tryorama'

export const CONFIG = Config.gen()
export const wait = ms => new Promise((r, j)=>setTimeout(r, ms))