import axios from '@/libs/api.request'
export const getUser = (data) => {
  return axios.request({
    url: '/users/getUser',
    method: 'get',
    params: data
  })
}

export const createUser = (data) => {
  return axios.request({
    url: '/users/createUser',
    method: 'post',
    data: data
  })
}
export const delUser = (data) => {
  return axios.request({
    url: '/users/delUser',
    method: 'post',
    data: data
  })
}
