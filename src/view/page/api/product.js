import axios from '@/libs/api.request'
export const getProducts = (data) => {
  return axios.request({
    url: '/product/getProducts',
    method: 'get',
    params: data
  })
}

export const createProduct = (data) => {
  return axios.request({
    url: '/product/createProduct',
    method: 'post',
    data: data
  })
}
export const editProduct = (data) => {
  return axios.request({
    url: '/product/editProduct',
    method: 'post',
    data: data
  })
}
export const upload = (data) => {
  return axios.request({
    url: '/upload/img',
    method: 'post',
    data: data
  })
}
