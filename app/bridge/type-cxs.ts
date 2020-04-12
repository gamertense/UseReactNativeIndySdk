import type { SMSPendingInvitationPayload } from '../sms-pending-invitation/type-sms-pending-invitation'

export type VcxCreateConnection = {
  source_id: string
  invite_details: SMSPendingInvitationPayload
}
