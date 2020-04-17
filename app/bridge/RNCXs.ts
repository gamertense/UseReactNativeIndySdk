import { NativeModules } from 'react-native'
import type { VcxProvision, VcxProvisionResult } from './type-cxs'
import type { InvitationPayload } from '../invitation/type-invitation'
import { convertVcxProvisionResultToUserOneTimeInfo } from './vcx-transformers'

const { RNIndy } = NativeModules

export type AgencyPoolConfig = {
  agencyUrl: string
  agencyDID: string
  agencyVerificationKey: string
}

export type UserOneTimeInfo = {
  oneTimeAgencyDid: string
  oneTimeAgencyVerificationKey: string
  myOneTimeDid: string
  myOneTimeVerificationKey: string
  myOneTimeAgentDid: string
  myOneTimeAgentVerificationKey: string
}

export async function createOneTimeInfo(agencyConfig: AgencyPoolConfig): Promise<UserOneTimeInfo> {
  const vcxProvisionConfig: VcxProvision = {
    agency_url: agencyConfig.agencyUrl,
    agency_did: agencyConfig.agencyDID,
    agency_verkey: agencyConfig.agencyVerificationKey,
    wallet_name: 'alice_wallet',
    wallet_key: '123',
    protocol_type: '3.0',
  }
  const provisionVcxResult: string = await RNIndy.createOneTimeInfo(JSON.stringify(vcxProvisionConfig))
  const provisionResult: VcxProvisionResult = JSON.parse(provisionVcxResult)
  return convertVcxProvisionResultToUserOneTimeInfo(provisionResult)
}

export async function createConnectionWithInvite(): Promise<number> {
  const invite_details = {
    '@id': 'aa54cd60-bcf7-440e-a200-99da55f30a5d',
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
    label: 'alice',
    recipientKeys: ['HvX5JJ3o7qLqpooqq5ENjDHzoBcd9u11xY2Lur1afPKc'],
    routingKeys: ['DaUxe968JwUJb4JJvZRjTVtEhSzPAXkaPm2SLe9vNYMY', 'Hezce2UWMZ3wUhVkh2LfKSs8nDzWwzs2Win7EzNN3YaR'],
    serviceEndpoint: 'http://localhost:8080/agency/msg',
  }
  const connectionHandle: number = await RNIndy.createConnectionWithInvite(
    'aa54cd60-bcf7-440e-a200-99da55f30a5d',
    JSON.stringify(invite_details)
  )

  return connectionHandle
}
