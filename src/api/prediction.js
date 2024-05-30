import request from 'src/utils/request';

class PredictionAPI {
  static endPoint = '/predictions';

  static async create(data) {
    return request.post(`${PredictionAPI.endPoint}`, {
      data,
    });
  }
}

export default PredictionAPI;
