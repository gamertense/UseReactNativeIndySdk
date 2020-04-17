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
