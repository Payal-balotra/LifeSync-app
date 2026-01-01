export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
   AUTH: {
      LOGIN: "/api/auth/login",
      SIGNUP: "/api/auth/signup",
      LOGOUT: "/api/auth/logout",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: (token) => `/api/auth/reset-password/${token}`,
      REFRESH_TOKEN : "/api/auth/refresh",
      ME: "/api/auth/me", 
   },
   SPACE: {
      CREATE: "/api/spaces",
      GET_ALL: "/api/spaces",
      GET_ONE :(spaceId)=>`/api/spaces/${spaceId}`,
      GET_SPACE_MEMBERS: (spaceId) => `/api/spaces/${spaceId}/members`,
      UPDATE_MEMBER_ROLE: (spaceId, memberId) => `/api/spaces/${spaceId}/members/${memberId}`,
      REMOVE_MEMBER: (spaceId, memberId) => `/api/spaces/${spaceId}/members/${memberId}`

   },
   TASK: {
      CREATE: (spaceId) => `/api/spaces/${spaceId}/tasks`,
      GET_TASK: (spaceId) => `/api/spaces/${spaceId}/tasks`,
      UPDATE_TASK: (spaceId, taskId) => `/api/spaces/${spaceId}/tasks/${taskId}`,
      DELETE_TASK: (spaceId, taskId) => `/api/spaces/${spaceId}/tasks/${taskId}`,


   },
   INVITE: {
      SEND: (spaceId) => `/api/invites/${spaceId}/invite`,
      ACCEPT: "/api/invites/accept",
      RESEND: (inviteId) => `/api/invites/${inviteId}/resend`,
      REJECT: (inviteId) => `/api/invites/reject/${inviteId}`,
      GET_INVITES: `/api/invites/my`
   },
   ACTIVITY: {
      GET_ACTIVITY_FEED: (spaceId) => `/api/spaces/${spaceId}/activity`
   }


}