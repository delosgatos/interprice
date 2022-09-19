<template>
  <div :class="name+'-table'">
    <AppTableFrame
      :key="
        (table.totalRows ? table.totalRows : 0) + table.columns.length
      "
      :name="name"
      :table="table"
      :active-sort-field="activeSortField"
      @sort="onSortChange"
    />
    <AppTablePagination
      v-if="table && table.totalRows"
      :on-per-page-change="onPerPageChange"
      :rows="table.rows"
      :total-rows="Number(table.totalRows)"
      :per-page="Number(dataParams.perPage)"
      :page="Number(table.page)"
      :rows-per-page-block="rowsPerPageBlock"
      :per-page-title="perPageTitle"
      @on-page-change="onPageChange"
      @on-per-page-change="onPerPageChange"
    />
  </div>
</template>

<script>
export default {
    components: {
        AppTableFrame: () => import('@/components/AppTableFrame'),
        AppTablePagination: () => import('@/components/AppTablePagination'),
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        table: { type: Object, required: true },
        perPage: {
            type: Number,
            default: 10,
        },
        paginationPage: {
            type: Number,
        },
        rowsPerPageBlock: {
            type: Boolean,
            default: false,
        },
        perPageTitle: {
            type: String,
        },
        activeSortField: {
            type: String,
        },
    },
    data () {
        return {
            dataParams: {
                columnFilters: {},
                sort: [
                    {
                        field: '',
                        type: '',
                    },
                ],
                page: 1,
                perPage: this.perPage,
            },
        };
    },
    methods: {
        updateParams (newProps) {
            this.dataParams = Object.assign({}, this.dataParams, newProps);
        },

        onPageChange (params) {
            this.updateParams({ page: params.currentPage });
            this.loadItems();
        },

        onPerPageChange (params) {
            if (params.currentPerPage != this.dataParams.perPage) {
                this.updateParams({ perPage: params.currentPerPage, page: 1 });
                this.loadItems();
            }
            this.dataParams.perPage = params.currentPerPage;
        },

        onSortChange (params) {
            this.updateParams({
                sort: [
                    {
                        type: params[0].type,
                        field: params[0].field,
                    },
                ],
            });
            this.loadItems();
        },

        loadItems () {
            const sort = this.dataParams.sort[0];
            const newSortType = sort.type ? { [sort.field]: sort.type } : {};
            const newDataParams = { ...this.dataParams };
            newDataParams.sort = newSortType;
            this.getData(newDataParams);
            this.$emit('sort', newDataParams.sort);
        },

        getData (params) {
            setTimeout(() => {
                const payload = {
                    sort: Object.keys(params.sort).length ? params.sort : [],
                    page: params.page,
                    perPage: params.perPage,
                };
                this.$emit('getData', payload);
            });
        },
    },
};
</script>

<style scoped></style>
