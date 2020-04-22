import { NativeModules } from 'react-native'
import type { AgencyPoolConfig, VcxProvision, VcxProvisionResult, CxsInitConfig, VcxInitConfig } from './type-cxs'
import type { UserOneTimeInfo } from './type-user-store'
import type { invitationPayload } from './type-invitation'
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

export async function createConnectionWithInvite(inviteDetails: invitationPayload): Promise<number> {
  const connectionHandle: number = await RNIndy.createConnectionWithInvite('faber', JSON.stringify(inviteDetails))

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

export async function proofGetRequests(connectionHandle: number): Promise<string> {
  return await RNIndy.proofGetRequests(connectionHandle)
}

export async function proofCreateWithRequest(sourceId: string, proofRequest: string): Promise<number> {
  return await RNIndy.proofCreateWithRequest(sourceId, proofRequest)
}

export async function proofRetrieveCredentials(proofHandle: number): Promise<string> {
  return await RNIndy.proofRetrieveCredentials(proofHandle)
}

export async function generateProof(
  proofHandle: number,
  selectedCredentials: string,
  selfAttestedAttributes: string
): Promise<void> {
  return await RNIndy.proofGenerate(proofHandle, selectedCredentials, selfAttestedAttributes)
}

export async function sendProof(proofHandle: number, connectionHandle: number): Promise<void> {
  return await RNIndy.proofSend(proofHandle, connectionHandle)
}
