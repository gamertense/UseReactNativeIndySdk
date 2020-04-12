import { InvitationPayload } from '../invitation/type-invitation'
import type { VcxCreateConnection } from './type-cxs'

export function convertInvitationToVcxConnectionCreate(invitation: InvitationPayload): VcxCreateConnection {
  return {
    source_id: invitation.requestId,
    invite_details: {
      connReqId: invitation.requestId,
      // TODO: Add status code to be available in invitation payload
      // for now, it would always be MS-102
      statusCode: 'MS-102',
      senderDetail: invitation.senderDetail,
      senderAgencyDetail: invitation.senderAgencyDetail,
      targetName: invitation.senderName,
      // hard coding this for now, because this field does not matter anywhere for processing
      // and it will always be message sent for the purpose of connection create
      // statusMsg: 'message sent',
    },
  }
}
