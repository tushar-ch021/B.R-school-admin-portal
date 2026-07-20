import api from './api';

const feeService = {
  collectFee: async (feeData) => {
    const response = await api.post('/fees/collect', feeData);
    return response.data;
  },

  getFeeHistory: async (studentId) => {
    const response = await api.get(`/fees/student/${studentId}`);
    return response.data;
  },

  getStudentFeeSummary: async (studentId) => {
    const response = await api.get(`/fees/student/${studentId}/summary`);
    return response.data;
  },

  updateStudentDues: async (studentId, duesData) => {
    const response = await api.put(`/fees/student/${studentId}/update-dues`, duesData);
    return response.data;
  },

  getDashboardStats: async (className = '', section = '') => {
    const response = await api.get('/fees/dashboard-stats', {
      params: { className, section }
    });
    return response.data;
  }
};

export default feeService;
