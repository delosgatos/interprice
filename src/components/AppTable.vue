<template>
  <div :class="name+'-table'">
    <AppTableFrame
      :key="
        (table.totalRows ? table.totalRows : 0) + table.columns.length
      "
      :name="name"
      :table="table"
      @sort="onSort"
    />
  </div>
</template>

<script>
export default {
    components: {
        AppTableFrame: () => import('@/components/AppTableFrame'),
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        table: { 
            type: Object, 
            required: true 
        },
    },
    data () {
        return {
            dataParams: {
                filters: {

                },
                sort: {
                    field: '',
                    type: '',
                },
            },
        };
    },
    methods: {
        updateParams (newProps) {
            this.dataParams = Object.assign({}, this.dataParams, newProps);
        },

        onSort (params) {
            this.$emit('sort', params);
            this.updateParams({
                sort: params,
            });
            this.loadItems();
        },

        loadItems () {
            this.getData(this.dataParams);
        },

        getData (params) {
            setTimeout(() => {
                this.$emit('getData', params);
            });
        },
    },
};
</script>

<style scoped></style>
