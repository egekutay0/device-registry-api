import { z } from "zod";
import { DEVICE_TYPES } from "../models/device.js";

const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

const networkSchema = z.object({
  hostname: z.string().min(1, "hostname boş olamaz"),
  ipAddress: z.string().regex(ipv4Regex, "Geçerli bir IPv4 adresi olmalıdır"),
  macAddress: z.string().min(1, "macAddress boş olamaz"),
  managementPort: z.number().int().min(1).max(65535),
  dhcp: z.boolean(),
});

const locationSchema = z.object({
  site: z.string().min(1),
  room: z.string().min(1),
  rack: z.string().min(1),
  rackUnit: z.number().int().positive(),
});

const displaySchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  refreshRate: z.number().int().positive(),
});

const capabilitiesSchema = z.object({
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  codecs: z.array(z.string()),
  maxResolution: z.string().min(1),
});

const statusSchema = z.object({
  online: z.boolean(),
  lastSeenAt: z.coerce.date().nullable(),
});

export const createDeviceSchema = z.object({
  deviceCode: z.string().min(1, "deviceCode boş olamaz"),
  name: z.string().min(1, "name boş olamaz"),
  type: z.enum(DEVICE_TYPES),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  serialNumber: z.string().min(1),
  firmwareVersion: z.string().min(1).optional(),
  network: networkSchema,
  location: locationSchema,
  display: displaySchema,
  capabilities: capabilitiesSchema,
  status: statusSchema,
  tags: z.array(z.string()),
  enabled: z.boolean(),
  notes: z.string().optional(),
});

export const updateDeviceSchema = createDeviceSchema;

export const patchDeviceSchema = z.object({
  deviceCode: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  type: z.enum(DEVICE_TYPES).optional(),
  manufacturer: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  serialNumber: z.string().min(1).optional(),
  firmwareVersion: z.string().min(1).optional(),
  network: networkSchema.partial().optional(),
  location: locationSchema.partial().optional(),
  display: displaySchema.partial().optional(),
  capabilities: capabilitiesSchema.partial().optional(),
  status: statusSchema.partial().optional(),
  tags: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  notes: z.string().optional(),
});
export const bulkCreateDeviceSchema = z.object({
  devices: z
    .array(createDeviceSchema)
    .min(1, "En az bir cihaz gönderilmelidir"),
});