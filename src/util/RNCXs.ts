import { NativeModules } from 'react-native'
import type {
  AgencyPoolConfig,
  VcxProvision,
  VcxProvisionResult,
  CxsInitConfig,
  VcxInitConfig,
  InitWithGenesisPathConfig,
} from './type-cxs'
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
    protocol_type: '2.0',
  }
  const provisionVcxResult: string = await RNIndy.createOneTimeInfo(JSON.stringify(vcxProvisionConfig))
  const provisionResult: VcxProvisionResult = JSON.parse(provisionVcxResult)
  return convertVcxProvisionResultToUserOneTimeInfo(provisionResult)
}

export async function init(config: CxsInitConfig, fileName: string): Promise<boolean> {
  const genesis_path: string = await RNIndy.getGenesisPathWithConfig(config.poolConfig, fileName)
  const initConfig: InitWithGenesisPathConfig = {
    ...config,
    genesis_path,
  }
  const vcxInitConfig: VcxInitConfig = await convertCxsInitToVcxInit(initConfig, wallet_name)
  const initResult: boolean = await RNIndy.init(JSON.stringify(vcxInitConfig))

  return initResult
}

export async function createConnectionWithInvite(inviteDetails: invitationPayload): Promise<number> {
  const connectionHandle: number = await RNIndy.createConnectionWithInvite('faber', JSON.stringify(inviteDetails))
  console.debug(`connectionHandle = ${connectionHandle}`)
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
  console.debug('acceptInvitationVcx result: ', result)
}

export async function getConnectionState(connectionHandle: number): Promise<number> {
  const state = await RNIndy.connectionGetState(connectionHandle)
  console.debug('getConnectionState() result = ', state)
  return state
}

export async function updateConnectionState(connectionHandle: number) {
  const res = await RNIndy.vcxConnectionUpdateState(connectionHandle)
  return res
}

export async function getCredentialOffers(connectionHandle: number): Promise<string> {
  const offers = await RNIndy.credentialGetOffers(connectionHandle)
  console.debug('getCredentialOffers', offers)
  return offers
}

export async function createCredentialWithOffer(sourceId: number, offer: string): Promise<number> {
  return await RNIndy.credentialCreateWithOffer(sourceId, offer)
}

export async function sendCredentialRequest(
  credentialHandle: number,
  connectionHandle: number,
  paymentHandle: number
): Promise<void> {
  await RNIndy.credentialSendRequest(credentialHandle, connectionHandle, paymentHandle)
  console.log('serializeClaimOffer\n', await RNIndy.serializeClaimOffer(credentialHandle))
}

export async function getCredentialState(credentialHandle: number): Promise<number> {
  const state: number = await RNIndy.credentialGetState(credentialHandle)
  console.debug('credentialState', state)
  return state
}

export async function updateCredentialState(credentialHandle: number) {
  const updatedState: number = await RNIndy.credentialUpdateState(credentialHandle)

  return updatedState
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
