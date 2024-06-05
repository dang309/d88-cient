import request from 'src/utils/request';

class PredictionResultAPI {
  static endPoint = '/prediction-results';

  static async update(id, data) {
    return request.put(`${PredictionResultAPI.endPoint}/${id}`, {
      data,
    });
  }
}

export default PredictionResultAPI;
