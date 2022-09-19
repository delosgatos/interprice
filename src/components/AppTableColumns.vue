<template>
  <div class="tr tr-shadow">
    <div
      v-for="(column, index) in columns"
      v-show="column.show"
      :id="name + column.field + '%%%' + 'column'"
      :key="column.field + index"
      :style="{
        width: `${
          column.width
            ? Number(column.width)
            : '100'
        }px`,
      }"
      class="th"
      :class="{
        [column.thClass]: true,
        'sort-asc': activeSortField === column.field + '_asc_',
        'sort-desc': activeSortField === column.field + '_desc_',
      }"
    >
      <span>
        {{ column.label }}
      </span>
      <div
        class="hover-grip"
        @mouseover="
          (event) =>
            $emit('mouseover', {
              event: event,
              active: true,
              id: name + column.field + '%%%' + 'column',
            })
        "
        @mouseleave="
          (event) =>
            $emit('mouseleave', {
              event: event,
              active: false,
              id: name + column.field + '%%%' + 'column',
            })
        "
      />
      <div
        class="th-arrow"
        @click="
          () => {
            column.sortable && $emit('sort', column.field)
          }
        "
      >
        <svg
          width="100%"
          height="100%"
        >
          <use xlink:href="#arrow-border-blue" />
        </svg>
      </div>
      <div
        class="th-arrow-default"
        @click="
          () => {
            column.sortable && $emit('sort', column.field)
          }
        "
      >
        <svg
          width="100%"
          height="100%"
        >
          <use xlink:href="#arrow-border-d4d4d4" />
        </svg>
      </div>
      <div class="th-top-border" />
    </div>
  </div>
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
        activeSortField: {
            type: String,
        },
    },
    mounted () {
        setTimeout(() => {
            this.$emit('headerAlreadyRendered', true);
        });
    },
    beforeDestroy () {
        this.$emit('headerAlreadyRendered', false);
    },
};
</script>

<style lang="scss" scoped>
.tr {
    display: flex;
    position: relative;
}
.tr-shadow.tr-shadow-active {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
}
.tbody > .tr {
    background: #f6f6f6;
}
.tbody > .tr:nth-child(even) {
    background-color: #f9f9f9;
}
.tr:last-child .td {
    border-bottom: 0px;
}
.td,
.th {
    border: thin solid #ececec;
    border-top: 0px;
    border-bottom: 0px;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    font-size: 12px;
    line-height: 14px;
    color: #4d4d4d;
    border-left: 0;
    border-right: 0;
    box-sizing: border-box;
}
.th {
    padding: 24px 16px;
    font-weight: bold;
    border-top: 0px;
}
.th.sort {
    .th-arrow-default {
        display: block;
    }
}
.th.sort-desc,
.th.sort-asc {
    .th-arrow {
        display: block;
    }
    .th-arrow-default {
        display: none;
    }
    &:first-child {
        &:after {
            left: 1px;
        }
    }
}

.th.sort-asc {
    .th-arrow {
        transform: rotate(180deg);
    }
}
.th-arrow {
    position: absolute;
    right: 8px;
    top: calc(50% - 8px);
    width: 16px;
    height: 16px;
    display: none;
    cursor: pointer;
}
.th-arrow-default {
    display: none;
    position: absolute;
    right: 8px;
    top: calc(50% - 8px);
    width: 16px;
    height: 16px;
    display: none;
    cursor: pointer;
}
.th:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    background-color: #ececec;
    left: calc(100% - 2px);
    top: 0;
}

.th:last-child:before {
    display: none;
    border-right: thin solid #ececec;
}

.hover-grip {
    position: absolute;
    width: 5px;
    height: 100%;
    top: 0;
    right: 1px;
}

.tr-blue {
    background-color: $pr_blue_one005;
}
// text
.td-text-left {
    text-align: left;
    span {
        padding-right: 10px;
    }
}
// number
.td-text-right {
    text-align: right;
    padding-left: 10px;

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

.th-sticky {
    position: sticky;
    left: 0;
    z-index: 6;
    background: #f6f6f6;
}

.mi-dropdown {
    background-color: #fff;
    border: thin solid $pr_input;
    border-radius: 5px;
    width: 104px;
    height: 26px;
    &__icon {
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: -1px;
        right: 0;
    }
    &__title {
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
        color: #4d4d4d;
    }
}
.theme--light.v-btn,
.v-application .pr_headers2--text {
    color: transparent;
}

.mi-dropdown .v-btn:not(.v-btn--text):not(.v-btn--outlined):focus:before,
.v-btn:not(.v-btn--text):not(.v-btn--outlined):focus:before,
.v-list:focus:before {
    opacity: 0;
}
.theme--light.v-list-item:hover::before {
    opacity: 0;
}
.v-list-item {
    min-height: 30px;
    cursor: pointer;
    &:hover {
        background-color: $pr_blue_one005;
    }
}
.v-btn:before {
    background-color: transparent;
}
.v-menu__content {
    margin-top: 4px;
}

.content-max250 {
    max-width: 250px;
    white-space: normal;
}

.siteModeration-table .td {
    overflow: hidden;
}
.point-filter-active {
    .point-filter {
        display: block;
    }
}
.point-filter {
    display: none;
    width: 10px;
    height: 10px;
    cursor: pointer;
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s;

    &__icon {
        width: 10px;
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: none;
        svg {
            fill: #d4d4d4;
            width: 100%;
            height: 100%;
        }
    }

    &:hover {
        .point-filter__icon {
            svg {
                fill: #007cd7;
            }
        }
    }

    &_position {
        right: 26px;
    }
}
.creativesModeration-table {
    .th {
        padding: 24px 8px 24px 16px;
    }
    .th-arrow-default,
    .th-arrow {
        right: 5px;
    }
}
.modal-log-table {
    .th {
        &:first-child {
            width: 144px !important;
        }
        &:nth-child(2) {
            width: 126px !important;
        }
        &:last-child {
            width: 162px !important;
        }
    }
}
</style>
