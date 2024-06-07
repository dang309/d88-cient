import request from 'src/utils/request';

class MatchAPI {
  static endPoint = '/matches';

  static async getComingMatch(query) {
    return request.get(`${MatchAPI.endPoint}/coming${query ? `?${query}` : ''}`);
  }
}

export default MatchAPI;
