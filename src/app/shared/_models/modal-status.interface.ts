export interface ModalStatus {
  closeStatus: ModalCloseStatusEnum
  // data?: T
}
export enum ModalCloseStatusEnum {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CLOSED = 'closed'
}
