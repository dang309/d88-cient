import request from 'src/utils/request';

class BetAPI {
  static endPoint = '/bets';

  static async getOne(id) {
    return request.get(`${BetAPI.endPoint}/${id}`);
  }

  static async create(data) {
    return request.post(BetAPI.endPoint, {
      data,
    });
  }

  static async update(id, body) {
    return request.patch(`${BetAPI.endPoint}/${id}`, body);
  }

  static async delete(id) {
    return request.delete(`${BetAPI.endPoint}/${id}`);
  }

  static async deleteMany(ids) {
    return request.delete(`${BetAPI.endPoint}`, { data: { ids } });
  }
}

export default BetAPI;
