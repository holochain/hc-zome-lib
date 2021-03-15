import { Config, InstallAgentsHapps, InstalledHapp, TransportConfigType } from '@holochain/tryorama'
import path = require('path')

// const NETOWRK = {
//   transport_pool: [{
//     type: TransportConfigType.Quic,
//   }],
//   bootstrap_service: "https://bootstrap.holo.host"
// }
const NETOWRK = {
  transport_pool: [{
    type: TransportConfigType.Mem,
  }]
}

export const CONFIG = Config.gen({network: NETOWRK})

export const chatDna = path.join(__dirname, "../hc-zomes.dna")

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
export const installation1agent: InstallAgentsHapps = [
  [[chatDna]],
]
export const installation2agent: InstallAgentsHapps = [
  [[chatDna]],
  [[chatDna]],
]
