import { NativeModules } from 'react-native'
import type { AgencyPoolConfig, VcxProvision, VcxProvisionResult, CxsInitConfig, VcxInitConfig } from './type-cxs'
import type { UserOneTimeInfo } from './type-user-store'
import { convertVcxProvisionResultToUserOneTimeInfo, convertCxsInitToVcxInit } from './vcx-transformers'

const { RNIndy } = NativeModules

const wallet_name = 'alice_wallet'

export async function createOneTimeInfo(agencyConfig: AgencyPoolConfig): Promise<UserOneTimeInfo> {
  const vcxProvisionConfig: VcxProvision = {
    agency_url: agencyConfig.agencyUrl,
    agency_did: agencyConfig.agencyDID,
    agency_verkey: agencyConfig.agencyVerificationKey,
    wallet_name,
    wallet_key: '123',
    protocol_type: '3.0',
  }
  const provisionVcxResult: string = await RNIndy.createOneTimeInfo(JSON.stringify(vcxProvisionConfig))
  const provisionResult: VcxProvisionResult = JSON.parse(provisionVcxResult)
  return convertVcxProvisionResultToUserOneTimeInfo(provisionResult)
}

export async function init(config: CxsInitConfig): Promise<boolean> {
  // const genesis_path: string = await RNIndy.getGenesisPathWithConfig(config.poolConfig, fileName)
  // const genesis_path = '/storage/emulated/0/Download/pool_transactions_genesis.txn'
  const vcxInitConfig: VcxInitConfig = await convertCxsInitToVcxInit(config, wallet_name)
  const initResult: boolean = await RNIndy.init(JSON.stringify(vcxInitConfig))

  return initResult
}

export async function createConnectionWithInvite(): Promise<number> {
  const invite_details = {
    '@id': '713c4c91-0925-43b0-b935-f87c30d54667',
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
    label: 'alice',
    recipientKeys: ['D5BGv22Vp4EAg7eFTkKrC4roJmxGi3iWVpYc1JTixctk'],
    routingKeys: ['25ssTgwWp63Vru4JpSyCzWrqyjyD7DdDqCtmw9RWagAx', 'Hezce2UWMZ3wUhVkh2LfKSs8nDzWwzs2Win7EzNN3YaR'],
    serviceEndpoint: 'http://192.168.1.35:8080/agency/msg',
  }
  const connectionHandle: number = await RNIndy.createConnectionWithInvite('faber', JSON.stringify(invite_details))

  return connectionHandle
}

export async function acceptInvitationVcx(connectionHandle: number) {
  // hard coding connection options to QR type for now, because vcx needs connection options
  // API for vcx assumes that it is running on enterprise side and not from consumer side
  // hence it tries to create connection with connection type.
  // However, our need is not to create a connection but to create a connection instance
  // with existing invitation. So, for now for any invitation type QR or SMS
  // we are hard coding connection option to QR
  const connectionOptions = { connection_type: 'QR', phone: '' }
  const result: string = await RNIndy.vcxAcceptInvitation(connectionHandle, JSON.stringify(connectionOptions))
  console.log('acceptInvitationVcx result: ', result)
}

export async function getConnectionState(connectionHandle: number) {
  const state = await RNIndy.connectionGetState(connectionHandle)
  console.log('getConnectionState() result = ', state)
  return state
}

export async function updateConnectionState(connectionHandle: number) {
  const res = await RNIndy.vcxConnectionUpdateState(connectionHandle)
  console.log('updateConnectionState() result = ', res)
  return res
}
