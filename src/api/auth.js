import request from "src/utils/request";

class AuthAPI {
  static endPoint = "/auth";

  static async login(username, password) {
    return request.post(`${AuthAPI.endPoint}/local`, { identifier: username, password });
  }

  static async loginWithGoogle(accessToken) {
    return request.get(`${AuthAPI.endPoint}/google/callback?access_token=${accessToken}`);
  }

  static async changePassword(oldPassword, newPassword) {
    return request.post(`${AuthAPI.endPoint  }/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  static async checkToken(token) {
    return request.get(`${AuthAPI.endPoint  }/check-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async generateTokenSystem(body) {
    return request.post(`${AuthAPI.endPoint}/generate-token-system`, body);
  }

  static async generateTokenUser(body) {
    return request.post(`${AuthAPI.endPoint}/generate-token-user`, body);
  }
}

export default AuthAPI;