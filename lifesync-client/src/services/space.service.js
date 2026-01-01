import api from "./axios";
import { API_PATHS } from "./apiPaths";

export const getMySpaces = async () => {
  const res = await api.get(API_PATHS.SPACE.GET_ALL);
  return res.data;
};
export const createSpace = async ({name}) => {
  const res = await api.post(API_PATHS.SPACE.CREATE, {name});
  return res.data;
};
export const getSpaceMembers = async (spaceId) =>{
  const res = await api.get(API_PATHS.SPACE.GET_SPACE_MEMBERS(spaceId));
  return res.data;
}