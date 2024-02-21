<template>
	<div></div>
</template>

<script setup lang="ts" name="login">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElNotification } from "element-plus"
import { GlobalStore } from "@/stores"
import { TabsStore } from "@/stores/modules/tabs"
import { KeepAliveStore } from "@/stores/modules/keepAlive"
import { getTimeState } from "@/utils/util"
import { HOME_URL } from "@/config/config"
import { initDynamicRouter } from "@/routers/modules/dynamicRouter"
import { UserManager, WebStorageStateStore } from "oidc-client"

const router = useRouter()
const tabsStore = TabsStore()
const keepAlive = KeepAliveStore()
const globalStore = GlobalStore()

onMounted(() => {
	const mgr = new UserManager({ response_mode: "query", userStore: new WebStorageStateStore() })
		.signinRedirectCallback()
		.then(async function (user) {
			console.log("signin response success", user)
			globalStore.setToken(user.access_token)
			// 2.添加动态路由
			await initDynamicRouter()
			// 3.清空 tabs、keepAlive 保留的数据
			tabsStore.closeMultipleTab()
			keepAlive.setKeepAliveName()
			// 4.跳转到首页
			router.push(HOME_URL)
			ElNotification({
				title: getTimeState(),
				message: "欢迎登录 河精基础框架",
				type: "success",
				duration: 3000
			})
		})
		.catch(function (err) {
			console.log(err)
		})
})
</script>

<style scoped lang="scss"></style>
