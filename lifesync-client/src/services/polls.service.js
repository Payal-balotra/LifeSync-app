import api from "./axios";
import { API_PATHS } from "./apiPaths";

export const getPolls = async (spaceId) => {
  const res = await api.get(API_PATHS.POLLS.GET_POLL(spaceId));
  return res.data;
};

export const votePoll = async (pollId, optionId) => {
  const res = await api.post(
    API_PATHS.POLLS.VOTE_POLL(pollId),
    { optionId }
  );
  return res.data;
};

export const createPoll = async (spaceId, data) => {
  const res = await api.post(
    API_PATHS.POLLS.CREATE_POLL(spaceId),
    data
  );
  return res.data;
};
