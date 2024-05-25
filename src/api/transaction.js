import request from 'src/utils/request';

class TransactionAPI {
  static endPoint = '/transactions';

  static async getOne(id) {
    return request.get(`${TransactionAPI.endPoint}/${id}`);
  }

  static async create(data) {
    return request.post(TransactionAPI.endPoint, {
      data,
    });
  }

  static async update(id, body) {
    return request.patch(`${TransactionAPI.endPoint}/${id}`, body);
  }

  static async delete(id) {
    return request.delete(`${TransactionAPI.endPoint}/${id}`);
  }

  static async deleteMany(ids) {
    return request.delete(`${TransactionAPI.endPoint}`, { data: { ids } });
  }
}

export default TransactionAPI;
