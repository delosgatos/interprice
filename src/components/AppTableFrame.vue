<template>
    <table
        class="table-container" 
        width="100%" 
        role="table" 
        aria-label="Destinations"
        :ref="name + 'wrapper'"
    >
        <caption>{{ name }}</caption>
        <AppTableHead
            :name="name"
            :columns="columnRows"
            @mouseover="(data) => gripMethod(data)"
            @mouseleave="(data) => gripMethod(data)"
            @headerAlreadyRendered="(bool) => (headerAlreadyRendered = bool)"
            @sort="onSort"
        />
        <tbody 
            v-if="headerAlreadyRendered"
            id="table"
            :ref="name + 'table-body'"
        >
            <AppTableRow
                v-for="(row, indexrow) in rows"
                :key="indexrow"
                :row-count="indexrow"
                :row="row"
                :name="name"
                :columns-width="columnsWidth"
                :columns-key-order="columnsKeyOrder"
                :columns-key-order-type="columnsKeyOrderType"
                :sort-params="sortParams"
            />
        </tbody>
    </table>
</template>

<script>
export default {
    components: {
        AppTableHead: () => import('@/components/AppTableHead'),
        AppTableRow: () => import('@/components/AppTableRow'),
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        table: { type: Object, required: true },
        rowCount: {
            type: Number,
        },
    },
    data () {
        return {
            headerAlreadyRendered: false,
            columnsKeyOrderType: {},
            columnsWidth: [],
            sortParams: {},
        };
    },
    computed: {
        rows () {
            return this.table.rows;
        },
        columns () {
            const cc = this.table.columns.reduce((o,n) => o.concat(n), []);
            return cc.filter(c=>!c.colspan);
        },
        columnRows () {
            return this.table.columns;
        },
        columnsKeyOrder () {
            this.columnsKeyOrderType = {};
            const columnsKeyOrder = this.columns.map((objItem) => {
                this.columnsKeyOrderType[objItem.field] = objItem.type;
                return objItem.field;
            });
            return columnsKeyOrder;
        },
    },
    watch: {
        headerAlreadyRendered (to, from) {

        },
    },
    methods: {
        onSort (data) {
            this.sortParams = data;
            this.$emit('sort', data);
        },
    },
};
</script>

<style lang="scss" scoped>
    caption {
        display: none;
    }
    .table-container {
        //display: block;
        margin: 1em auto;
        border-collapse: collapse;
    }

    @media only screen and (max-width: $size_mobile) {
        
        .table-container {
            //display: block;
        }
        
    }
</style>