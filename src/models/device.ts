export const DEVICE_TYPES = [
  "controller",
  "encoder",
  "decoder",
  "display",
  "kvm",
  "network",
  "other",
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface DeviceNetwork {
  hostname: string;
  ipAddress: string;
  macAddress: string;
  managementPort: number;
  dhcp: boolean;
}

export interface DeviceLocation {
  site: string;
  room: string;
  rack: string;
  rackUnit: number;
}

export interface DeviceDisplay {
  width: number;
  height: number;
  refreshRate: number;
}

export interface DeviceCapabilities {
  inputs: string[];
  outputs: string[];
  codecs: string[];
  maxResolution: string;
}

export interface DeviceStatus {
  online: boolean;
  lastSeenAt: Date | null;
}

export interface Device {
  id: string;
  deviceCode: string;
  name: string;
  type: DeviceType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  network: DeviceNetwork;
  location: DeviceLocation;
  display: DeviceDisplay;
  capabilities: DeviceCapabilities;
  status: DeviceStatus;
  tags: string[];
  enabled: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceDocument extends Omit<Device, "id"> {
  _id: string;
}

export function toDevice(document: DeviceDocument): Device {
  const { _id, ...rest } = document;
  return { id: _id, ...rest };
}