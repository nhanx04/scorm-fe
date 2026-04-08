// Định nghĩa Interface map chính xác với NotificationResponse.java
export interface Notification {
  notificationId: number
  title: string
  message: string
  type: string
  isRead: boolean
  referenceId: number | null
  referenceType: string | null
  createdAt: string
}

// Cập nhật lại interface này khớp với cấu trúc Page<T> của Spring Boot
export interface NotificationListResponse {
  content: Notification[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  empty: boolean
}
