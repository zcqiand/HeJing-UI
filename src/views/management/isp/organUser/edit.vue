<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="userName" label="用户名称">
				<el-input v-model="formData.userName" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="email" label="邮箱">
				<el-input v-model="formData.email" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="phoneNumber" label="手机">
				<el-input v-model="formData.phoneNumber" placeholder="请输入" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { getApi, createApi, updateApi } from "@/api/management/isp/organUser"

//#region 初始化
const emit = defineEmits(["success"])

onMounted(() => {})
//#endregion

//#region 主体
//设置表单
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (id: undefined | string) => {
	if (id === undefined) {
		resetForm()
	} else {
		currentUpdateId.value = id
		getApi({
			id: id
		})
			.then((res: any) => {
				formData.userName = res.data.userName
				formData.email = res.data.email
				formData.emailConfirmed = res.data.emailConfirmed
				formData.phoneNumber = res.data.phoneNumber
				formData.phoneNumberConfirmed = res.data.phoneNumberConfirmed
				formData.lockoutEnabled = res.data.lockoutEnabled
				formData.lockoutEnd = res.data.lockoutEnd
				formData.twoFactorEnabled = res.data.twoFactorEnabled
				formData.accessFailedCount = res.data.accessFailedCount
			})
			.catch(() => {
				resetForm()
			})
			.finally(() => {})
	}
	dialogVisible.value = true
}
//重置表单
const resetForm = () => {
	currentUpdateId.value = undefined
	formData.userName = ""
	formData.email = ""
	formData.emailConfirmed = ""
	formData.phoneNumber = ""
	formData.phoneNumberConfirmed = ""
	formData.lockoutEnabled = ""
	formData.lockoutEnd = ""
	formData.twoFactorEnabled = ""
	formData.accessFailedCount = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	userName: "",
	email: "",
	emailConfirmed: "",
	phoneNumber: "",
	phoneNumberConfirmed: "",
	lockoutEnabled: "",
	lockoutEnd: "",
	twoFactorEnabled: "",
	accessFailedCount: ""
})
const formRules: FormRules = reactive({
	userName: [{ required: true, trigger: "blur", message: "请输入用户名称" }]
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					userName: formData.userName,
					email: formData.email,
					emailConfirmed: formData.emailConfirmed,
					phoneNumber: formData.phoneNumber,
					phoneNumberConfirmed: formData.phoneNumberConfirmed,
					lockoutEnabled: formData.lockoutEnabled,
					lockoutEnd: formData.lockoutEnd,
					twoFactorEnabled: formData.twoFactorEnabled,
					accessFailedCount: formData.accessFailedCount
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					userName: formData.userName,
					email: formData.email,
					emailConfirmed: formData.emailConfirmed,
					phoneNumber: formData.phoneNumber,
					phoneNumberConfirmed: formData.phoneNumberConfirmed,
					lockoutEnabled: formData.lockoutEnabled,
					lockoutEnd: formData.lockoutEnd,
					twoFactorEnabled: formData.twoFactorEnabled,
					accessFailedCount: formData.accessFailedCount
				}).then(() => {
					ElMessage.success("修改成功")
					dialogVisible.value = false
					emit("success")
				})
			}
		} else {
			return false
		}
	})
}
//另存为
const handleSaveAs = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			createApi({
				userName: formData.userName,
				email: formData.email,
				emailConfirmed: formData.emailConfirmed,
				phoneNumber: formData.phoneNumber,
				phoneNumberConfirmed: formData.phoneNumberConfirmed,
				lockoutEnabled: formData.lockoutEnabled,
				lockoutEnd: formData.lockoutEnd,
				twoFactorEnabled: formData.twoFactorEnabled,
				accessFailedCount: formData.accessFailedCount
			}).then(() => {
				dialogVisible.value = false
				emit("success")
			})
		} else {
			return false
		}
	})
}
//#endregion

defineExpose({
	handleUpdate
})
</script>
