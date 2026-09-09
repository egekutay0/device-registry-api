import request from "supertest";
import { app } from "../app.js";
import { closeDatabase, connectToDatabase, getDb } from "../config/database.js";
import type { CreateDeviceInput } from "../models/device.js";

function buildDevice(suffix: string): CreateDeviceInput {
  return {
    deviceCode: `FTW-JEST-${suffix}`,
    name: `Jest Test Device ${suffix}`,
    type: "controller",
    manufacturer: "4TheWall",
    model: "Wall Controller",
    serialNumber: `SN-JEST-${suffix}`,
    network: {
      hostname: `jest-host-${suffix}`,
      ipAddress: "192.168.99.10",
      macAddress: "00:11:22:33:99:01",
      managementPort: 8080,
      dhcp: false,
    },
    location: {
      site: "Test Site",
      room: "Test Room",
      rack: "R99",
      rackUnit: 1,
    },
    display: {
      width: 1920,
      height: 1080,
      refreshRate: 60,
    },
    capabilities: {
      inputs: ["HDMI"],
      outputs: ["HDMI"],
      codecs: ["H264"],
      maxResolution: "1920x1080",
    },
    status: {
      online: true,
      lastSeenAt: new Date("2026-09-01T10:00:00.000Z"),
    },
    tags: ["jest"],
    enabled: true,
    notes: "Jest testi",
  };
}

beforeAll(async () => {
  await connectToDatabase();
  await getDb().collection("devices").deleteMany({});
});

afterAll(async () => {
  await closeDatabase();
});

describe("Health", () => {
  it("Test 1 - GET /api/v1/health 200 dönmeli", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});

describe("Device CRUD", () => {
  it("Test 2 - geçerli cihaz POST edilince 201 dönmeli", async () => {
    const response = await request(app)
      .post("/api/v1/devices")
      .send(buildDevice("001"));

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.deviceCode).toBe("FTW-JEST-001");
  });

  it("Test 3 - duplicate deviceCode 409 dönmeli", async () => {
    await request(app).post("/api/v1/devices").send(buildDevice("002"));

    const response = await request(app)
      .post("/api/v1/devices")
      .send(buildDevice("002"));

    expect(response.status).toBe(409);
  });

  it("Test 4 - var olan cihaz GET edilince 200 dönmeli", async () => {
    const created = await request(app)
      .post("/api/v1/devices")
      .send(buildDevice("003"));

    const response = await request(app).get(
      `/api/v1/devices/${created.body.data.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.deviceCode).toBe("FTW-JEST-003");
  });

  it("Test 5 - olmayan cihaz GET edilince 404 dönmeli", async () => {
    const response = await request(app).get("/api/v1/devices/boyle-bir-id-yok");

    expect(response.status).toBe(404);
  });

  it("Test 6 - geçersiz payload 4xx dönmeli", async () => {
    const invalid = { ...buildDevice("004"), name: "" };

    const response = await request(app).post("/api/v1/devices").send(invalid);

    expect(response.status).toBe(400);
  });

  it("Test 7 - PATCH yalnızca gönderilen alanı değiştirmeli", async () => {
    const created = await request(app)
      .post("/api/v1/devices")
      .send(buildDevice("005"));

    const response = await request(app)
      .patch(`/api/v1/devices/${created.body.data.id}`)
      .send({ enabled: false, status: { online: false } });

    expect(response.status).toBe(200);
    expect(response.body.data.enabled).toBe(false);
    expect(response.body.data.status.online).toBe(false);
    expect(response.body.data.status.lastSeenAt).not.toBeNull();
    expect(response.body.data.name).toBe("Jest Test Device 005");
  });

  it("Test 8 - eksik zorunlu alanla PUT reddedilmeli", async () => {
    const created = await request(app)
      .post("/api/v1/devices")
      .send(buildDevice("006"));

    const response = await request(app)
      .put(`/api/v1/devices/${created.body.data.id}`)
      .send({ name: "sadece isim" });

    expect(response.status).toBe(400);
  });

  it("Test 9 - DELETE sonrası aynı ID GET edilince 404 dönmeli", async () => {
    const created = await request(app)
      .post("/api/v1/devices")
      .send(buildDevice("007"));

    const id = created.body.data.id;

    const deleteResponse = await request(app).delete(`/api/v1/devices/${id}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/v1/devices/${id}`);
    expect(getResponse.status).toBe(404);
  });
});