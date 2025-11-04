export type Role = 'staff' | 'driver' | 'officer'

export function isOfficer(role?: string | null): role is 'officer' {
  return role === 'officer'
}
export function isDriver(role?: string | null): role is 'driver' {
  return role === 'driver'
}
export function isStaff(role?: string | null): role is 'staff' {
  return role === 'staff'
}

