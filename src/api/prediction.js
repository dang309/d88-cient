import request from 'src/utils/request';

class PredictionAPI {
  static endPoint = '/predictions';

  static async create(data) {
    return request.post(`${PredictionAPI.endPoint}`, {
      data,
    });
  }

  static async update(id, data) {
    return request.put(`${PredictionAPI.endPoint}/${id}`, {
      data,
    });
  }

  static async delete(id) {
    return request.delete(`${PredictionAPI.endPoint}/${id}`);
  }
}

export default PredictionAPI;
