<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" title="功能授权" @close="resetForm" width="50%">
    <div class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <div>
        <el-button type="primary" :icon="Select" :disabled="selection.length == 0" @click="handleCreate">确认</el-button>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        row-key="functionId"
        ref="multipleTableRef"
        @selection-change="selectionChange"
        border
        default-expand-all
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="name" label="名称">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper">
      <el-pagination
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :current-page="paginationData.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, defineExpose, onMounted } from "vue"
import { type TableInstance, type FormInstance, ElMessage } from "element-plus"
import { updateFunctionApi } from "@/api/management/common/ownerRole"
import { queryApi } from "@/api/management/common/ownerRoleFunction"
import { Search, Refresh, Select } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

//#region 初始化
const props = defineProps({
  ownerId: String
})
const emit = defineEmits(["success"])
const loading = ref<boolean>(false)
const multipleTableRef = ref<TableInstance>()
const currentUpdateId = ref<undefined | string>(undefined)

onMounted(() => {})
//#endregion

//#region 主体
//查询
const handleSearch = () => {
  queryTableData()
}
//查询重置
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  queryTableData()
}

//表格选择
const selection = ref<any[]>([])
const selectionChange = (items: any[]) => {
  selection.value = items
}
//获取清单
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: ""
})
const tableData = ref<any[]>([])
const queryTableData = () => {
  loading.value = true
  queryApi({
    pageIndex: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    roleId: currentUpdateId.value,
    name: searchData.name || undefined
  })
    .then((res: any) => {
      paginationData.total = res.data.total
      tableData.value = res.data.items
      tableData.value
        .filter(d => d.isRole)
        .forEach(item => {
          setTimeout(() => {
            multipleTableRef.value!.toggleRowSelection(item, true)
          })
        })
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({
  pageSize: 10
})
watch([() => paginationData.currentPage, () => paginationData.pageSize], queryTableData, { immediate: true })

//设置表单
const handleUpdate = (id: undefined | string) => {
  currentUpdateId.value = id
  queryTableData()
  dialogVisible.value = true
}
//重置表单
const resetForm = () => {
  currentUpdateId.value = undefined
}
//保存
const dialogVisible = ref<boolean>(false)
const handleCreate = () => {
  updateFunctionApi({
    id: currentUpdateId.value,
    functionIds: selection.value.map(v => v.functionId)
  }).then(() => {
    ElMessage.success("修改成功")
    dialogVisible.value = false
    emit("success")
  })
}
//#endregion

defineExpose({
  handleUpdate
})
</script>

<style lang="scss" scoped>
@import "../../index";
</style>
