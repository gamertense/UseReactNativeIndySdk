import type { UserOneTimeInfo } from './type-user-store'

export type AgencyPoolConfig = {
  agencyUrl: string
  agencyDID: string
  agencyVerificationKey: string
  poolConfig: string
}

export type VcxProvision = {
  agency_url: string
  agency_did: string
  agency_verkey: string
  wallet_name: string
  wallet_key: string
  protocol_type: string
}

export type VcxProvisionResult = {
  wallet_name: string
  wallet_key: string
  agency_endpoint: string
  agency_did: string
  agency_verkey: string
  // myOneTimeDid
  sdk_to_remote_did: string
  // myOneTimeVerificationKey
  sdk_to_remote_verkey: string
  // oneTimeAgencyDid
  institution_did: string
  // oneTimeAgencyVerificationKey
  institution_verkey: string
  // myOneTimeAgentDid
  remote_to_sdk_did: string
  // myOneTimeAgentVerificationKey
  remote_to_sdk_verkey: string
}

export type VcxInitConfig = {
  agency_endpoint: string
  agency_did: string
  agency_verkey: string
  genesis_path: string
  wallet_key: string
  // config: string
  // pool_name: string
  wallet_name: string
  remote_to_sdk_did: string
  remote_to_sdk_verkey: string
  sdk_to_remote_did: string
  sdk_to_remote_verkey: string
  institution_did: string
  institution_verkey: string
  institution_name: string
  institution_logo_url: string
}

export type CxsInitConfig = UserOneTimeInfo & AgencyPoolConfig

export type InitWithGenesisPathConfig = CxsInitConfig & { genesis_path: string }

export type StateType = {
  None: 0
  Initialized: 1
  OfferSent: 2
  RequestReceived: 3
  Accepted: 4
  Unfulfilled: 5
  Expired: 6
  Revoked: 7
  Redirected: 8
  Rejected: 9
}
