import { request, CommonBaseURL } from "@/api"

/* 新增 */
export function createApi(data: any) {
	return request({
		url: CommonBaseURL + "/common/organRoleData/Create",
		method: "post",
		data
	})
}

/* 更新 */
export function updateApi(data: any) {
	return request({
		url: CommonBaseURL + "/common/organRoleData/Update",
		method: "post",
		data
	})
}

/* 删除 */
export function deleteApi(data: any) {
	return request({
		url: CommonBaseURL + "/common/organRoleData/Delete",
		method: "post",
		data
	})
}

/* 批量删除 */
export function batchDeleteApi(data: any) {
	return request({
		url: CommonBaseURL + "/common/organRoleData/BatchDelete",
		method: "post",
		data
	})
}

/* 获取清单 */
export function queryApi(params: any) {
	return request({
		url: CommonBaseURL + "/common/organRoleData/Query",
		method: "get",
		params
	})
}

/* 获取详情 */
export function getApi(params: any) {
	return request({
		url: CommonBaseURL + "/common/organRoleData/Get",
		method: "get",
		params
	})
}
