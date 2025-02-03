<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" title="资源授权" @close="resetForm" width="50%">
    <div class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="title" label="标题">
          <el-input v-model="searchData.title" placeholder="请输入" />
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
        :tree-props="treeProps"
        ref="multipleTableRef"
        row-key="resourceId"
        @selection-change="selectionChange"
        border
        default-expand-all
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="title" label="标题">
          <template #default="scope">{{ scope.row.title }}</template>
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
import { updateResourceApi } from "@/api/management/common/ownerRole"
import { queryApi } from "@/api/management/common/ownerRoleResource"
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
const treeProps = reactive({
  checkStrictly: true
})

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
  title: ""
})
const tableData = ref<any[]>([])
const queryTableData = () => {
  loading.value = true
  queryApi({
    pageIndex: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    roleId: currentUpdateId.value,
    title: searchData.title || undefined
  })
    .then((res: any) => {
      paginationData.total = res.data.total
      tableData.value = res.data.items
      selectRows(tableData.value)
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const selectRows = (data: any) => {
  data.forEach(row => {
    if (row.isRole) {
      setTimeout(() => {
        multipleTableRef.value!.toggleRowSelection(row, true)
      })
    }
    if (row.children) {
      selectRows(row.children) // 递归处理子节点
    }
  })
}
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
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
  updateResourceApi({
    id: currentUpdateId.value,
    resourceIds: selection.value.map(v => v.resourceId)
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
