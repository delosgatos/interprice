<template>
  <Fragment>
    <div
      v-if="row"
      ref="trRow"
      class="tr"
      :class="{ 'tr-blue-full-result': isTotal }"
      @mouseover="() => (hoveredRow = row.id)"
      @mouseleave="() => (hoveredRow = null)"
    >
      <div
        v-for="(columnKey, index) of columnsKeyOrder"
        :id="name + columnKey + '_' + 'row_column'"
        :key="columnKey + row.id + index"
        :ref="columnKey"
        class="td"
        :style="{
          width: `${columnsWidth[index]}px`,
        }"
        :class="
          customClasses({
            field: columnKey,
            sortable: false,
            index,
            row,
          })
        "
      >
        <div v-if="columnKey === 'date'"
            class="justify-end d-flex">
          {{ row[columnKey] }}
        </div>
        <div v-else-if="columnKey === 'name'"
            class="$pr_headers2--text pr_headers2--text-addition content-max200 mb-1">
          {{ row[columnKey] }}
        </div>
        <div v-else>
            {{ row[columnKey] }}
        </div>
      </div>
    </div>
  </Fragment>
</template>

<script>
import _ from 'lodash';
import { Fragment } from 'vue-fragment';

import { customClasses } from '@/helpers/CompleteCustomTableData';

export default {
    components: {
        Fragment,
    },
    props: {
        row: {
            type: Object,
            required: true,
        },
        rowCount: {
            type: Number,
        },
        columnsKeyOrder: {
            type: Array,
            required: true,
        },
        columnsKeyOrderType: {
            type: Object,
        },
        name: {
            type: String,
            required: true,
        },
        columnsWidth: {
            type: Array,
            required: true,
        },
        isTotal: {
            type: Boolean,
            default: false,
        },
        units: {
            type: Array,
            default: null,
        },
    },
    data () {
        return {
            hoveredRow: null,
            numberList: [ 'views', 'clicks', 'visits', 'show', 'visits' ],
            moneyList: [ 'CTR', 'placeCTR', 'CPM', 'moneyIn' ],
            fieldList: [
                'name',
            ],
        };
    },
    computed: {
        locale () {
            return this.$root.$i18n.locale;
        },
    },
    mounted () {
        console.log('columns',this.columnsKeyOrder)
    },
    methods: {
        customClasses,
        getLodashMethod (obj, key, defaultValue) {
            return _.get(obj, key, defaultValue);
        },
        linkIdUser (str) {
            if (str) {
                const newstr = str.split('(')[1].split(')')[0];
                return newstr;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.tr {
    display: flex;
}
.tbody .tr {
    transition: all 0.1s;
    &:hover {
        background-color: $pr_blue_one005 !important;

        .text-blue {
            color: #007cd7;
        }
    }
}
.tbody .tr.tr-error-red {
    transition: all 0.1s;

    background-color: #fcf3f4;
    .td:first-child {
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background-color: #cb1c31;
        }
    }
}
.tbody .tr.tr-error-gray {
    transition: all 0.1s;

    .td:first-child {
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background-color: #4d4d4d;
        }
    }
}
.tbody .tr.tr-error-red.tr-error-gray {
    .td:first-child {
        &:after {
            content: '';
            position: absolute;
            left: 4px;
            top: 0;
            width: 3px;
            height: 100%;
            background-color: #4d4d4d;
        }
        &:before {
            background-color: #cb1c31;
        }
    }
}
.tbody .tr .td-error-yellow::before {
    content: '';
    position: absolute;
    left: 0px;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: #caffe2;
}
.tbody .tr.tr-active-mass {
    background-color: #f2f8fd;
}
.td-together {
    display: flex;
    align-items: center;
}
.td-slash {
    width: 10px;
    padding-left: 3px;
}
.icon-document {
    display: inline-block;
    width: 9px;
    height: 11px;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMCAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuMDUwNzEgMC43NUgxLjg1MDc3QzEuNTcyMjkgMC43NSAxLjMwNTIzIDAuODYwNjIzIDEuMTA4MzEgMS4wNTc1M0MwLjkxMTQwNCAxLjI1NDQ0IDAuODAwNzgxIDEuNTIxNTEgMC44MDA3ODEgMS43OTk5OVYxMC4xOTk5QzAuODAwNzgxIDEwLjQ3ODMgMC45MTE0MDQgMTAuNzQ1NCAxLjEwODMxIDEwLjk0MjNDMS4zMDUyMyAxMS4xMzkyIDEuNTcyMjkgMTEuMjQ5OSAxLjg1MDc3IDExLjI0OTlIOC4xNTA2OEM4LjQyOTE1IDExLjI0OTkgOC42OTYyMiAxMS4xMzkyIDguODkzMTMgMTAuOTQyM0M5LjA5MDA0IDEwLjc0NTQgOS4yMDA2NyAxMC40NzgzIDkuMjAwNjcgMTAuMTk5OVYzLjg5OTk2TDYuMDUwNzEgMC43NVoiIHN0cm9rZT0iIzAwN0NENyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik02LjA1MDc4IDAuNzVWMy44OTk5Nkg5LjIwMDc0IiBzdHJva2U9IiMwMDdDRDciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNy4xMDIyOSA2LjUyNTM5SDIuOTAyMzQiIHN0cm9rZT0iIzAwN0NENyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik03LjEwMjI5IDguNjI1SDIuOTAyMzQiIHN0cm9rZT0iIzAwN0NENyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zLjk1MjMzIDQuNDIzODNIMy40MjczNEgyLjkwMjM0IiBzdHJva2U9IiMwMDdDRDciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K');
    background-position: center center;
    background-repeat: no-repeat;
}
.prevAdvImg {
    display: block;
    width: 60px;

    img {
        display: block;
        width: 100%;
    }
}
.td-currency-icon {
    width: 24px;
    height: 24px;
    margin: 0 auto;
}

.tr:last-child .td {
    border-bottom: 0px;
}

.td {
    border: thin solid #ececec;
    border-top: 0px;
    border-bottom: 0px;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    font-size: 12px;
    padding: 12px 16px;
    line-height: 14px;
    color: #4d4d4d;
    border-left: 0;
    border-right: 0;
    transition: all 0.1s;
    box-sizing: border-box;
}

.tr-blue-full-result {
    background-color: #f7fbfe !important;
    color: #4d4d4d;
    font-weight: bold;
    td,
    span,
    div {
        color: #4d4d4d;
        font-weight: bold;
    }
    &:hover {
        background-color: $pr_blue_one005 !important;
    }
}

.tr:last-child {
    border-bottom: 1px solid #ececec;
    .td-control-mist__mess {
        top: auto;
        bottom: -22px;
        &:after {
            top: auto;
            bottom: 24px;
        }
    }
}
.tr:nth-last-child(-n + 2) {
    .td-control-mist__mess {
        top: auto;
        bottom: -22px;
        &:after {
            top: auto;
            bottom: 24px;
        }
    }
}
.tr:nth-last-child(-n + 3) {
    .td-control-mist__mess {
        top: auto;
        bottom: -22px;
        &:after {
            top: auto;
            bottom: 24px;
        }
    }
}
.tr:nth-child(even) {
    background-color: #f9f9f9;
}

.td:last-child:before {
    display: none;
    border-right: thin solid #ececec;
}

.tr-blue {
    background-color: $pr_blue_one005;
}
// text
.td-text-left {
    text-align: left;
}

// number
.td-text-right {
    text-align: right;
    padding-left: 10px;
    span {
        padding-left: 10px;
    }

    .th-arrow {
        left: 8px;
        right: auto;
    }
    .th-arrow-default {
        left: 8px;
        right: auto;
    }
}

// object
.td-text-center {
    text-align: center;
    span {
        padding-right: 8px;
    }
}

.font-14 {
    font-size: 14px;
}

.content-max200 {
    max-width: 200px;
    a {
        text-decoration: none;
    }
}

.pr_headers2--text-addition {
    overflow-x: auto;
    overflow-y: hidden;
}

.text-row-left {
    text-align: left;
}
</style>
