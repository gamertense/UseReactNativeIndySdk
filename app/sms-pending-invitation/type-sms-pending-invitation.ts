export type AgentKeyDelegationProof = {
  agentDID: string
  agentDelegatedKey: string
  signature: string
}

export type InvitationSenderDetail = {
  name: string
  agentKeyDlgProof: AgentKeyDelegationProof
  DID: string
  logoUrl: string
  verKey: string
}

export type InvitationSenderAgencyDetail = {
  DID: string
  verKey: string
  endpoint: string
}

export type SMSPendingInvitationPayload = {
  connReqId: string
  statusCode: string
  senderDetail: InvitationSenderDetail
  senderAgencyDetail: InvitationSenderAgencyDetail
  targetName: string
}
