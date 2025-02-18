﻿import { request, CommonBaseURL } from "@/api"

/* 新增 */
export function createApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/Create",
    method: "post",
    data
  })
}

/* 更新 */
export function updateApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/Update",
    method: "post",
    data
  })
}

/* 更新成员 */
export function updateEmployeeApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/UpdateEmployee",
    method: "post",
    data
  })
}

/* 更新成员 */
export function updateFunctionApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/UpdateFunction",
    method: "post",
    data
  })
}

/* 更新成员 */
export function updateResourceApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/UpdateResource",
    method: "post",
    data
  })
}

/* 删除 */
export function deleteApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/Delete",
    method: "post",
    data
  })
}

/* 批量删除 */
export function batchDeleteApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/BatchDelete",
    method: "post",
    data
  })
}

/* 获取清单 */
export function queryApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/Query",
    method: "get",
    params
  })
}

/* 获取详情 */
export function getApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRole/Get",
    method: "get",
    params
  })
}
