import { API_PATHS } from "./apiPaths";
import api from "./axios";

export const createTask = async (spaceId, payload) => {
  const res = await api.post(
    API_PATHS.TASK.CREATE(spaceId),
    payload
  );
  return res.data;
};
export const getTasks = async (spaceId) => {
  const res = await api.get(
    API_PATHS.TASK.GET_TASK(spaceId)
  );
  return res.data;
};
export const updateTask =async(spaceId,taskId,payload)=>{
  const res = await api.patch(API_PATHS.TASK.UPDATE_TASK(spaceId,taskId),payload);
  return res.data;
}
export const deleteTask =async (spaceId,taskId) =>{
  const res =  await api.delete(API_PATHS.TASK.DELETE_TASK(spaceId,taskId));
  return res.data
}