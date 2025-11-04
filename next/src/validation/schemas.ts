import { z } from 'zod'

const zOnCheckbox = z.preprocess((v) => (v === 'on' || v === true ? true : false), z.boolean())
const zDate = z.preprocess((v) => {
  const d = new Date(String(v))
  return isNaN(d.getTime()) ? undefined : d
}, z.date())

export const CreateRequestSchema = z.object({
  requesterId: z.string().trim().min(1),
  purpose: z.string().trim().min(1),
  startLocation: z.string().trim().min(1, 'start location required'),
  destination: z.string().trim().min(1, 'destination required'),
  startTime: zDate,
  endTime: zDate,
  notes: z.string().trim().default(''),
}).refine((v) => v.startTime < v.endTime, { message: 'start < end', path: ['startTime'] })

export const ApproveAssignSchema = z.object({
  reqId: z.string().trim().min(1),
  vehicleId: z.string().trim().min(1),
  driverId: z.string().trim().min(1),
  override: zOnCheckbox,
})

export const StartTripSchema = z.object({
  bookingId: z.string().trim().min(1),
  startLocationType: z.enum(['Office', 'Warehouse', 'Other']),
  startLocationOther: z.string().trim().optional(),
  odometerStart: z.coerce.number().finite(),
}).transform((v) => ({
  ...v,
  startLocation: v.startLocationType === 'Other' ? (v.startLocationOther || '').trim() : v.startLocationType,
})).refine((v) => !!v.startLocation, { message: 'location required', path: ['startLocationOther'] })

export const EndTripSchema = z.object({
  bookingId: z.string().trim().min(1),
  endLocationType: z.enum(['Office', 'Warehouse', 'Other']),
  endLocationOther: z.string().trim().optional(),
  odometerEnd: z.coerce.number().finite(),
}).transform((v) => ({
  ...v,
  endLocation: v.endLocationType === 'Other' ? (v.endLocationOther || '').trim() : v.endLocationType,
})).refine((v) => !!v.endLocation, { message: 'location required', path: ['endLocationOther'] })

export const AddDriverSchema = z.object({ name: z.string().trim().min(1) })
export const RemoveDriverSchema = z.object({ driverId: z.string().trim().min(1) })
export const AssignVehicleDriverSchema = z.object({
  vehicleId: z.string().trim().min(1),
  driverId: z.string().optional().transform((s) => (s && s.length > 0 ? s : undefined)),
})
export const UpdateBookingStatusSchema = z.object({
  bookingId: z.string().trim().min(1),
  status: z.enum(['Booked', 'InUse', 'Completed'])
})
export const DeleteBookingSchema = z.object({ bookingId: z.string().trim().min(1) })

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  driverLicenseNo: z.string().optional(),
  driverLicenseExpiry: z.preprocess((v) => v ? new Date(String(v)) : undefined, z.date().optional()),
})

export const AdminUpdateUserSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  driverLicenseNo: z.string().optional(),
  driverLicenseExpiry: z.preprocess((v) => v ? new Date(String(v)) : undefined, z.date().optional()),
  active: z.preprocess((v) => v === 'on' ? true : v === 'true' ? true : false, z.boolean()).optional(),
})

export const AdminChangeRoleSchema = z.object({
  id: z.string().trim().min(1),
  role: z.enum(['staff','driver','officer']),
  reassignToDriverId: z.string().optional(),
})

export const AdminDeleteUserSchema = z.object({ id: z.string().trim().min(1) })
