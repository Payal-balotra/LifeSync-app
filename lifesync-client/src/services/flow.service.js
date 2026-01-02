import api from "./axios";
import { API_PATHS } from "./apiPaths";
export const getSpaceFlow = async (spaceId) => {
  const res = await api.get(API_PATHS.FLOW.GET_FLOW(spaceId));
  return res.data;
};

export const saveSpaceFlow = async (spaceId, flow) => {
  return api.put(API_PATHS.FLOW.UPDATE_FLOW(spaceId), flow);
};
