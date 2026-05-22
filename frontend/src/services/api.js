import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

// Greenhouses
export const getGreenhouses = async () => {
  const response = await api.get("/greenhouses");
  return response.data;
};

export const createGreenhouse = async (greenhouse) => {
  const response = await api.post("/greenhouses", greenhouse);
  return response.data;
};

export const updateGreenhouse = async (id, greenhouse) => {
  const response = await api.put(`/greenhouses/${id}`, greenhouse);
  return response.data;
};

export const deleteGreenhouse = async (id) => {
  await api.delete(`/greenhouses/${id}`);
};

// Zones
export const getZones = async () => {
  const response = await api.get("/zones");
  return response.data;
};

export const createZone = async (zone) => {
  const response = await api.post("/zones", zone);
  return response.data;
};

export const updateZone = async (id, zone) => {
  const response = await api.put(`/zones/${id}`, zone);
  return response.data;
};

export const deleteZone = async (id) => {
  await api.delete(`/zones/${id}`);
};

// Crops
export const getCrops = async () => {
  const response = await api.get("/crops");
  return response.data;
};

export const createCrop = async (crop) => {
  const response = await api.post("/crops", crop);
  return response.data;
};

export const updateCrop = async (id, crop) => {
  const response = await api.put(`/crops/${id}`, crop);
  return response.data;
};

export const deleteCrop = async (id) => {
  await api.delete(`/crops/${id}`);
};

// Sensors
export const getSensors = async () => {
  const response = await api.get("/sensors");
  return response.data;
};

export const createSensor = async (sensor) => {
  const response = await api.post("/sensors", sensor);
  return response.data;
};

export const updateSensor = async (id, sensor) => {
  const response = await api.put(`/sensors/${id}`, sensor);
  return response.data;
};

export const deleteSensor = async (id) => {
  await api.delete(`/sensors/${id}`);
};

// Actuators
export const getActuators = async () => {
  const response = await api.get("/actuators");
  return response.data;
};

export const createActuator = async (actuator) => {
  const response = await api.post("/actuators", actuator);
  return response.data;
};

export const updateActuator = async (id, actuator) => {
  const response = await api.put(`/actuators/${id}`, actuator);
  return response.data;
};

export const deleteActuator = async (id) => {
  await api.delete(`/actuators/${id}`);
};

export const executeActuatorCommand = async (code, command) => {
  const response = await api.patch(`/actuators/code/${code}/command`, {
    command,
  });

  return response.data;
};

// Sensor Readings
export const getSensorReadings = async () => {
  const response = await api.get("/sensor-readings");
  return response.data;
};

export const createSensorReading = async (reading) => {
  const response = await api.post("/sensor-readings", reading);
  return response.data;
};

export const updateSensorReading = async (id, reading) => {
  const response = await api.put(`/sensor-readings/${id}`, reading);
  return response.data;
};

export const deleteSensorReading = async (id) => {
  await api.delete(`/sensor-readings/${id}`);
};

export default api;