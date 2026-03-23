import axios from "axios";

export const checkUserStatus = async (receiverId, shop) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/api/users/check/user/available/${receiverId}`,
      {
        params: {
          shop: shop,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    return false;
  }
};
