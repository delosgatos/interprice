<template>
  <div
    slot=""
    :class="rowsPerPageBlock ? 'common-pagination--per-page' : ''"
    class="common-pagination"
  >
    <AppTableRowsPerPage
      v-if="rowsPerPageBlock"
      :per-page-title="perPageTitle"
      :per-page="perPage"
      @on-per-page-change="onPerPageChange"
    />
    <div
      v-if="true"
      class="common-pagination__wrap"
    >
      <div
        class="common-pagination__prev"
        @click="page > 1 ? changeActivePage(page - 1) : ''"
      >
        <svg
          width="100%"
          height="100%"
        >
          <use xlink:href="#arrowsmall-gray-d4d4d4" />
        </svg>
      </div>

      <div class="common-pagination__pages">
        <div
          v-for="pageObj of pagesArray"
          :key="pageObj.value"
          :class="pageObj.class"
          @click="
            typeof pageObj.value === 'number' &&
              pageObj.value !== page
              ? changeActivePage(pageObj.value)
              : ''
          "
        >
          {{ pageObj.value }}
        </div>
      </div>

      <div
        class="common-pagination__next"
        @click="page < totalPages ? changeActivePage(page + 1) : ''"
      >
        <svg
          width="100%"
          height="100%"
        >
          <use xlink:href="#arrowsmall-gray-d4d4d4" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    components: {
        AppTableRowsPerPage: () =>
            import(
                '@/components/AppTableRowsPerPage.vue'
            ),
    },
    props: {
        totalRows: {
            type: Number,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
        perPage: {
            type: Number,
            required: true,
        },
        page: {
            type: Number,
        },
        rowsPerPageBlock: {
            type: Boolean,
            default: false,
        },
        onPerPageChange: {
            type: Function,
        },
        perPageTitle: {
            type: String,
        },
    },
    data () {
        return {};
    },
    computed: {
        totalPages () {
            return Math.ceil(this.totalRows / this.perPage);
        },
        pagesArray () {
            let pagesArray = [];

            for (let i = 1; i <= this.totalPages; i++) {
                pagesArray.push(i);
            }

            if (this.page <= 4 && this.totalPages > 6) {
                pagesArray = [
                    ...pagesArray.slice(0, 6),
                    '...',
                    pagesArray[pagesArray.length - 1],
                ];
            } else if (
                this.page >= 4 &&
                this.totalPages > 6 &&
                this.page < this.totalPages - 3
            ) {
                pagesArray = [
                    pagesArray[0],
                    '...',
                    ...pagesArray.slice(this.page - 3, this.page + 2),
                    '...',
                    pagesArray[pagesArray.length - 1],
                ];
            } else if (
                this.page > 4 &&
                this.totalPages > 6 &&
                this.page >= this.totalPages - 3
            ) {
                if (this.page + 4 < pagesArray.length - 1) {
                    pagesArray = [
                        pagesArray[0],
                        '...',
                        ...pagesArray.slice(this.page - 3, this.page + 2),
                        '...',
                        pagesArray[pagesArray.length - 1],
                    ];
                } else {
                    pagesArray = [
                        pagesArray[0],
                        '...',
                        ...pagesArray.slice(pagesArray.length - 1 - 5),
                    ];
                }
            }

            return pagesArray.map((value) =>
                typeof value === 'number'
                    ? value === this.page
                        ? {
                            class:
                                  'common-pagination__page common-pagination__page-active',
                            value,
                        }
                        : { class: 'common-pagination__page', value }
                    : { class: 'common-pagination__dots', value }
            );
        },
    },
    methods: {
        changeActivePage (value) {
            const params = {
                currentPage: value,
            };
            this.$emit('on-page-change', params);
        },
    },
};
</script>

<style lang="scss" scoped>
.common-pagination {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &--per-page {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    &__wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: max-content;
        min-width: max-content;
    }

    &__prev {
        width: 16px;
        height: 16px;
        transform: rotate(-90deg);
        cursor: pointer;
    }
    &__next {
        width: 16px;
        height: 16px;
        transform: rotate(90deg);
        cursor: pointer;
    }

    &__pages {
        display: flex;
        padding: 0 16px;
    }
    &__page {
        font-size: 14px;
        line-height: 16px;
        font-weight: 500;
        color: $pr_headers2;
        margin-left: 6px;
        padding: 0 2px;
        min-width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        cursor: pointer;

        &.common-pagination__page-active {
            color: #007cd7;
        }
        &:hover {
            color: #007cd7;
            background-color: #eff6fa;
        }
        &:active {
            background-color: #ececec;
        }
    }
    &__dots {
        margin: 0 6px;
        width: 12px;
        font-size: 14px;
        line-height: 16px;
        color: $pr_headers2;
        display: flex;
        align-items: flex-end;
        padding-bottom: 5px;
    }
}
.modal-log-table {
    .common-pagination {
        display: none;
    }
}
.checkNextPage {
    margin-left: 6px;
}
</style>
