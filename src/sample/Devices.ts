interface Device {
  readonly deviceName: string;
  powerStatus: boolean;
  wearStatus: boolean;
  lastConnection: string;
  lastAccess: string;
  status: "정상" | "점검필요" | "비상";
}

const devices: Device[] = [
  {
    deviceName: "AICT-001",
    powerStatus: true,
    wearStatus: true,
    lastConnection: "2024-01-15 14:30:25",
    lastAccess: "2024-01-15 14:29:45",
    status: "정상",
  },
  {
    deviceName: "AICT-002",
    powerStatus: false,
    wearStatus: false,
    lastConnection: "2024-01-15 12:15:10",
    lastAccess: "2024-01-15 12:14:30",
    status: "점검필요",
  },
  {
    deviceName: "AICT-003",
    powerStatus: true,
    wearStatus: true,
    lastConnection: "2024-01-15 14:28:15",
    lastAccess: "2024-01-15 14:27:50",
    status: "정상",
  },
];

export default devices;
