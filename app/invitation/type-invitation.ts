import type {
  InvitationSenderAgencyDetail,
  AgentKeyDelegationProof,
  InvitationSenderDetail,
} from '../sms-pending-invitation/type-sms-pending-invitation'

export type InvitationPayload = {
  senderEndpoint: string
  requestId: string
  // senderAgentKeyDelegationProof: AgentKeyDelegationProof
  senderName: string
  senderDID: string
  senderLogoUrl: string
  senderVerificationKey: string
  targetName: string
  senderDetail: InvitationSenderDetail
  senderAgencyDetail: InvitationSenderAgencyDetail
}
