import { NativeModules } from 'react-native'
import type { InvitationPayload } from '../invitation/type-invitation'
import { convertInvitationToVcxConnectionCreate } from './vcx-transformers'

const { RNIndy } = NativeModules

export async function createConnectionWithInvite(invitation: InvitationPayload): Promise<number> {
  const { invite_details } = convertInvitationToVcxConnectionCreate(invitation)
  const connectionHandle: number = await RNIndy.createConnectionWithInvite(
    invitation.requestId,
    JSON.stringify(invite_details)
  )

  return connectionHandle
}
