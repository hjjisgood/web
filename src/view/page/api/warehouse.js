import axios from '@/libs/api.request'
export const getWarehouse = (data) => {
  return axios.request({
    url: '/warehouse/getWarehouse',
    method: 'get',
    params: data
  })
}

export const getHisIn = (data) => {
  return axios.request({
    url: '/warehouse/getHisIn',
    method: 'get',
    params: data
  })
}

export const getHisOut = (data) => {
  return axios.request({
    url: '/warehouse/getHisOut',
    method: 'get',
    params: data
  })
}

export const newIn = (data) => {
  return axios.request({
    url: '/warehouse/newIn',
    method: 'post',
    data: data
  })
}

export const setWarehouse = (data) => {
  return axios.request({
    url: '/warehouse/setWarehouse',
    method: 'post',
    data: data
  })
}

export const getHis = (data) => {
  return axios.request({
    url: '/warehouse/getHis',
    method: 'get',
    params: data
  })
}
