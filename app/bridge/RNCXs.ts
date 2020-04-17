import { NativeModules } from 'react-native'
import type { AgencyPoolConfig, VcxProvision, VcxProvisionResult, CxsInitConfig, VcxInitConfig } from './type-cxs'
import type { UserOneTimeInfo } from './type-user-store'
import type { InvitationPayload } from '../invitation/type-invitation'
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

  const initConfig = {
    ...config,
  }
  const vcxInitConfig: VcxInitConfig = await convertCxsInitToVcxInit(initConfig, wallet_name)
  const initResult: boolean = await RNIndy.init(JSON.stringify(vcxInitConfig))

  return initResult
}

export async function createConnectionWithInvite(): Promise<number> {
  const invite_details = {
    '@id': 'd2c4312c-8b66-4d22-b71b-f82143064ca6',
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
    label: 'alice',
    recipientKeys: ['H8XZQ5bGfM7hsB7MoBSJi18ZsNCVnjGZQqpnFtCJmJkc'],
    routingKeys: ['FiVNcZDRjjRrsXFSNbxpnA7yDQRaY68NKrPRrKwECb1C', 'Hezce2UWMZ3wUhVkh2LfKSs8nDzWwzs2Win7EzNN3YaR'],
    serviceEndpoint: 'http://192.168.1.35:8080/agency/msg',
  }
  const connectionHandle: number = await RNIndy.createConnectionWithInvite(
    'd2c4312c-8b66-4d22-b71b-f82143064ca6',
    JSON.stringify(invite_details)
  )

  return connectionHandle
}
