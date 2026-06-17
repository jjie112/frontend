import api from './instance'

export const productApi = {
  // 取得商品列表
  getAllPoudcts: () => api.get('/products'),
  // 取得單一商品
  getPoudctId: (id) => api.get(`/products/${id}`),
  // 新增商品
  create: (data) => api.post('/products', data),
  // 更新商品
  update: (id, data) => api.put(`/products/${id}`, data),
  // 刪除商品
  delete: (id) => api.delete(`/products/${id}`),
}
