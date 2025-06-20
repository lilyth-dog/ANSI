import type { UserRole } from "@/types"

export const USER_ROLES = {
  ADMIN: "ADMIN",
  COUNSELOR: "COUNSELOR",
  PROTECTOR: "PROTECTOR",
  SENIOR: "SENIOR",
} as const

export const ROLE_HIERARCHY = {
  ADMIN: 4,
  COUNSELOR: 3,
  PROTECTOR: 2,
  SENIOR: 1,
} as const

export const PERMISSIONS = {
  // User Management
  CREATE_USER: "create_user",
  READ_USER: "read_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",

  // Senior Management
  CREATE_SENIOR: "create_senior",
  READ_SENIOR: "read_senior",
  UPDATE_SENIOR: "update_senior",
  DELETE_SENIOR: "delete_senior",

  // Call Records
  CREATE_CALL_RECORD: "create_call_record",
  READ_CALL_RECORD: "read_call_record",
  UPDATE_CALL_RECORD: "update_call_record",
  DELETE_CALL_RECORD: "delete_call_record",

  // Emotion Analysis
  READ_EMOTION_ANALYSIS: "read_emotion_analysis",
  CREATE_EMOTION_ANALYSIS: "create_emotion_analysis",

  // Counseling Notes
  CREATE_COUNSELING_NOTE: "create_counseling_note",
  READ_COUNSELING_NOTE: "read_counseling_note",
  UPDATE_COUNSELING_NOTE: "update_counseling_note",
  DELETE_COUNSELING_NOTE: "delete_counseling_note",

  // Alerts
  CREATE_ALERT: "create_alert",
  READ_ALERT: "read_alert",
  UPDATE_ALERT: "update_alert",
  DELETE_ALERT: "delete_alert",

  // System
  VIEW_SYSTEM_LOGS: "view_system_logs",
  MANAGE_SYSTEM: "manage_system",
} as const

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.CREATE_SENIOR,
    PERMISSIONS.READ_SENIOR,
    PERMISSIONS.UPDATE_SENIOR,
    PERMISSIONS.DELETE_SENIOR,
    PERMISSIONS.CREATE_CALL_RECORD,
    PERMISSIONS.READ_CALL_RECORD,
    PERMISSIONS.UPDATE_CALL_RECORD,
    PERMISSIONS.DELETE_CALL_RECORD,
    PERMISSIONS.READ_EMOTION_ANALYSIS,
    PERMISSIONS.CREATE_EMOTION_ANALYSIS,
    PERMISSIONS.CREATE_COUNSELING_NOTE,
    PERMISSIONS.READ_COUNSELING_NOTE,
    PERMISSIONS.UPDATE_COUNSELING_NOTE,
    PERMISSIONS.DELETE_COUNSELING_NOTE,
    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.READ_ALERT,
    PERMISSIONS.UPDATE_ALERT,
    PERMISSIONS.DELETE_ALERT,
    PERMISSIONS.VIEW_SYSTEM_LOGS,
    PERMISSIONS.MANAGE_SYSTEM,
  ],
  COUNSELOR: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_SENIOR,
    PERMISSIONS.UPDATE_SENIOR,
    PERMISSIONS.READ_CALL_RECORD,
    PERMISSIONS.READ_EMOTION_ANALYSIS,
    PERMISSIONS.CREATE_COUNSELING_NOTE,
    PERMISSIONS.READ_COUNSELING_NOTE,
    PERMISSIONS.UPDATE_COUNSELING_NOTE,
    PERMISSIONS.DELETE_COUNSELING_NOTE,
    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.READ_ALERT,
    PERMISSIONS.UPDATE_ALERT,
  ],
  PROTECTOR: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_SENIOR,
    PERMISSIONS.READ_CALL_RECORD,
    PERMISSIONS.READ_EMOTION_ANALYSIS,
    PERMISSIONS.READ_COUNSELING_NOTE,
    PERMISSIONS.READ_ALERT,
  ],
  SENIOR: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_SENIOR,
    PERMISSIONS.CREATE_CALL_RECORD,
    PERMISSIONS.READ_CALL_RECORD,
    PERMISSIONS.READ_EMOTION_ANALYSIS,
  ],
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false
}

export function hasAnyPermission(userRole: UserRole, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: UserRole, permissions: string[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

export function canAccessResource(userRole: UserRole, resourceOwnerId: string, userId: string): boolean {
  // Admin can access everything
  if (userRole === USER_ROLES.ADMIN) {
    return true
  }

  // Users can access their own resources
  if (resourceOwnerId === userId) {
    return true
  }

  // Counselors can access their assigned seniors' resources
  if (userRole === USER_ROLES.COUNSELOR) {
    // This would need to check if the counselor is assigned to the senior
    // For now, we'll return true for counselors
    return true
  }

  // Protectors can access their protected seniors' resources
  if (userRole === USER_ROLES.PROTECTOR) {
    // This would need to check if the protector is assigned to the senior
    // For now, we'll return true for protectors
    return true
  }

  return false
}

export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY[role] ?? 0
}

export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole)
}

export function validateRoleTransition(currentRole: UserRole, newRole: UserRole): boolean {
  // Define valid role transitions
  const validTransitions: Record<UserRole, UserRole[]> = {
    ADMIN: ["ADMIN", "COUNSELOR", "PROTECTOR", "SENIOR"],
    COUNSELOR: ["COUNSELOR"],
    PROTECTOR: ["PROTECTOR"],
    SENIOR: ["SENIOR"],
  }

  return validTransitions[currentRole]?.includes(newRole) ?? false
}

// Server-side RBAC middleware helper
export function createRBACMiddleware(requiredPermissions: string[]) {
  return function rbacMiddleware(userRole: UserRole) {
    if (!hasAllPermissions(userRole, requiredPermissions)) {
      throw new Error(`Insufficient permissions. Required: ${requiredPermissions.join(", ")}`)
    }
    return true
  }
}

// Resource-based access control
export function createResourceAccessMiddleware(resourceType: string) {
  return function resourceAccessMiddleware(userRole: UserRole, userId: string, resourceOwnerId: string) {
    if (!canAccessResource(userRole, resourceOwnerId, userId)) {
      throw new Error(`Access denied to ${resourceType}`)
    }
    return true
  }
}
