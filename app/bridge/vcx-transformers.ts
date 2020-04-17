import type { VcxProvisionResult } from './type-cxs'
import { UserOneTimeInfo } from './type-user-store'

export function convertVcxProvisionResultToUserOneTimeInfo(provision: VcxProvisionResult): UserOneTimeInfo {
  return {
    oneTimeAgencyDid: provision.institution_did,
    oneTimeAgencyVerificationKey: provision.institution_verkey,
    myOneTimeDid: provision.sdk_to_remote_did,
    myOneTimeVerificationKey: provision.sdk_to_remote_verkey,
    myOneTimeAgentDid: provision.remote_to_sdk_did,
    myOneTimeAgentVerificationKey: provision.remote_to_sdk_verkey,
  }
}
