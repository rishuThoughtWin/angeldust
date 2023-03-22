export const SET_ADMIN = 'SET_ADMIN';


export function changeAdminPosition(payload) {
    return {
      type: SET_ADMIN,
      payload: payload,
    };
  }