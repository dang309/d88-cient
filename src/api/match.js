import request from 'src/utils/request';

class MatchAPI {
  static endPoint = '/matches';

  static async getComingMatch() {
    return request.get(`${MatchAPI.endPoint}/coming`);
  }
}

export default MatchAPI;
