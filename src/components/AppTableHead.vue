<template>
<thead ref="thead">
    <tr v-for="(columnRow, rowIndex) in columns"
        :key="'row-' + rowIndex"
        class="flex-table header" 
        role="rowgroup"
    >
        <th class="flex-row" role="columnheader"
            v-for="(column, index) in columnRow"
            v-show="column.show"
            :rowspan="column.rowspan"
            :colspan="column.colspan"
            :id="name + column.field + '%%%' + 'column'"
            :key="column.field + '-' + rowIndex + '-' + index"
            :style="{
                width: `${
                    column.width
                    ? Number(column.width)
                    : '100'
                }px`,
            }"
            :class="{
                [column.thClass]: !!column.thClass,
                'group': column.colspan && column.colspan > 1,
                'first': index === 0,
                'sortable': column.sortable,
                'sort-asc': activeSortField === column.field + '_asc',
                'sort-desc': activeSortField === column.field + '_desc',
            }"
        >
            <div class="th-content">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable"
                    class="th-arrow"
                    @click="activeSortFieldMethod(column.field)"
                >
                    <v-icon>mdi-triangle-small-down</v-icon>
                </div>
            </div>
        </th>
    </tr>
</thead>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        },
    },
    data () {
        return {
            activeSortField: '',
        };
    },
    mounted () {
        setTimeout(() => {
            this.$emit('headerAlreadyRendered', true);
        });
    },
    beforeDestroy () {
        this.$emit('headerAlreadyRendered', false);
    },
    methods: {

        activeSortFieldMethod (field) {
            let type;
            switch (this.activeSortField) {
                case field + '_desc':
                    type = 'asc';
                    break;
                case field + '_asc':
                    type = '';
                    break;
                default:
                    type = 'desc';
                    break;
            }
            this.activeSortField = type ? field + '_' + type : '';
            this.$emit('sort', { [field] : type } );
        },
    },
};
</script>
<style lang="scss" scoped>

thead {
    tr {
        border: 0!important;
    }
}

.th-arrow {
    display: none;
}


th {

    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
    background: $table-header-bg;
    padding: 0.2em;
    border: 0!important;
    position: relative;
    border-bottom: 1px solid $table-border;
    color: $table-head-text-color;
    vertical-align: bottom;
    font-weight: normal;
    font-size: 13px;
    &:after {
        content: '';
        position: absolute;
        height: 1px;
        background: $table-header-border;
        left: 0;
        right: 0;
        bottom: 0;
    }
    &.group {
        color: $pr_text;
        font-weight: bold;
        &:after {
            content: '';
            left: 10px;
            right: 10px;
            bottom: 0;
        }
    }
    &.sortable {
        .th-arrow {
            width: 16px;
            height: 16px;
            cursor: pointer;
            opacity: 0.5;
            display: inline-block;
            bottom: 2px;
            position: relative;
            transform-origin: 12px 12px;
            transition: all 0.3s;
        }
    }
    &.sort {
        .th-arrow-default {
            display: block;
        }
    }
    &.sort-desc,
    &.sort-asc {
        .th-arrow {
            display: block;
            opacity: 1;
            &-default {
                display: none;
            }
        }
        &:first-child {
            &:after {
                left: 1px;
            }
        }
    }
    &.sort-asc {
        .th-arrow {
            transform: rotate(180deg);
        }
    }
}

.th-content {
    display: flex;
    justify-content: center;
}
.text-left {
    .th-content {
        justify-content: start;
    }
}
.text-right {
    .th-content {
        justify-content: end;
    }
}

.flex-row {
    width: auto;
    text-align: center;
}

@media only screen and (max-width: $size_mobile) {
    th{
        width: auto;
        display: block;
        border: 0;
        border-left: solid 1px $table-header-border;
        border-right: solid 1px $table-header-border;
        border-bottom: solid 1px $table-header-border;
    }
    .flex-row {
        width: 100%;
    }
}



.tr-blue {
    background-color: $pr_blue_one005;
}
// text
.td-text {
    &-left {
        text-align: left;
        span {
            padding-right: 10px;
        }
    }
    // number
    &-right {
        text-align: right;
        padding-left: 10px;
        .th-arrow {
            left: 8px;
            right: auto;
            &-default {
                left: 8px;
                right: auto;
            }
        }
    }
    // object
    &-center {
        text-align: center;
        span {
            padding-right: 8px;
        }
    }
}
.th-sticky {
    position: sticky;
    left: 0;
    z-index: 6;
    background: #f6f6f6;
}
</style>