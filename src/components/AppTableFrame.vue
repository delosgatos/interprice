<template>
  <div
    :ref="name + 'wrapper'"
    class="wrapper"
  >
    <div
      :class="{
        'grid-body': true,
        'grid-body_md': 1200, //$vuetify.breakpoint.lgAndDown,
      }"
    >
      <div
        ref="thead"
        class="thead"
      >
        <AppTableColumns
          :name="name"
          :columns="selectedColumns"
          :active-sort-field="activeSortField"
          @mouseover="(data) => gripMethod(data)"
          @mouseleave="(data) => gripMethod(data)"
          @headerAlreadyRendered="(bool) => (headerAlreadyRendered = bool)"
          @sort="activeSortFieldMethod"
          @rowCheckbox="(data) => activeCheckboxesUpdateMethod(data)"
        />
        <!-- <div
          ref="theadRow"
          :style="{ position: 'relative' }"
        >
          <AppTableRow
            v-if="total && showTotalRow"
            :key="total.id"
            :row-count="1"
            :row="total"
            :name="name"
            :is-total="true"
            :columns-width="columnsWidth"
            :columns-key-order="columnsKeyOrder"
            :columns-key-order-type="columnsKeyOrderType"
            :units="units"
          />
        </div> -->
      </div>
      <div
        class="table-header-wrapper"
        @scroll="scroll"
      >
        <div
          :ref="name + 'grip'"
          :class="{
            grip: true,
            'grip-active': gripActive,
            'd-none': !gripScroll,
          }"
          @mouseover="gripActive = true"
          @mouseleave="gripActive = false"
          @mousedown="onGripMouseDown"
          @click="gripBottomLineActive = false"
        >
          <div
            :ref="name + 'grip__bottomLine'"
            class="grip__bottomLine"
            :class="{
              'grip__bottomLine-active': gripBottomLineActive,
            }"
            :style="{
              height: gripBottomLineHeight + 'px',
            }"
          />
        </div>
        <div
          id="table"
          :ref="name + 'table'"
          class="table table-relat"
        >
          <div
            v-if="headerAlreadyRendered"
            :ref="name + 'table-body'"
            :key="table.randomKey"
            class="tbody"
          >
            <AppTableRow
              v-for="(row, indexrow) in rows"
              :key="row.id"
              :row-count="indexrow"
              :row="row"
              :name="name"
              :columns-width="columnsWidth"
              :columns-key-order="columnsKeyOrder"
              :columns-key-order-type="columnsKeyOrderType"
              :units="units"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="phony-scroll" />
    <div class="grid-footer" />
  </div>
</template>

<script>
export default {
    components: {
        AppTableColumns: () => import('@/components/AppTableColumns'),
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
        activeSortField: {
            type: String,
        },
    },
    data () {
        return {
            headerAlreadyRendered: false,
            showTotalRow: false,
            modalExtraTop: 0,
            modalExtraLeft: 0,
            columnsKeyOrder: [],
            columnsKeyOrderType: {},
            columnsWidth: [],

            grip: null,
            gripScroll: null,
            gripActive: false,
            gripBottomLineHeight: 0,
            gripBottomLineActive: false,
            gripCoordsBefore: '',
            gripCoordsAfter: '',

            activeField: '',
        };
    },
    computed: {
        rows () {
            return this.table.rows;
        },
        columns () {
            return this.table.columns;
        },
        selectedColumns () {
            return this.columns;
        },
        randomKey () {
            return this.table.randomKey;
        },
        total () {
            return this.table.total;
        },
        units () {
            return this.columns.map((el) => el.unit);
        },
    },
    watch: {
        randomKey (newValue, oldValue) {
            if (!newValue) {return;}
            this.columnsKeyOrderMethod();
        },
        table (to, from) {
            this.$nextTick(() => {
                this.calculateColumnsWidth();
            });
        },
        headerAlreadyRendered (to, from) {
            this.calculateColumnsWidth();
        },
    },
    created () {
        window.addEventListener('scroll', this.removeActiveGrip);
        this.gripBottomLineHeight =
            this.$refs[this.name + 'wrapper'] &&
            this.$refs[this.name + 'wrapper'].offsetHeight;
    },
    mounted () {
        console.log('TABLE', this.table);
        console.log('COLUMNS', this.selectedColumns);
        this.columnsKeyOrderMethod();
        document.addEventListener('mouseup', this.onGripMouseUp);
    },
    beforeDestroy () {
        document.removeEventListener('mouseup', this.onGripMouseUp);
    },
    destroyed () {
        window.removeEventListener('scroll', this.removeActiveGrip);
    },
    methods: {
        activeSortFieldMethod (field) {
            let type;
            switch (this.activeSortField) {
                case '':
                    type = 'desc';
                    break;
                case field + '_desc_':
                    type = 'asc';
                    break;
                case field + '_asc_':
                    type = '';
                    break;
                default:
                    type = 'desc';
                    break;
            }
            this.$emit('sort', [ { field, type } ]);
        },

        columnsKeyOrderMethod () {
            this.columnsKeyOrderType = {};
            this.columnsKeyOrder = this.selectedColumns.map((objItem) => {
                this.columnsKeyOrderType[objItem.field] = objItem.type;
                return objItem.field;
            });
            console.log('columnsKeyOrder', this.columnsKeyOrder);
        },
        gripMethod ({ active, id, event }) {
            this.gripScroll = true;
            if (this.gripCoordsBefore) {return;}
            const tableWrapper = this.$refs[this.name + 'wrapper'];

            const tableWrapperRightSide = Math.round(
                tableWrapper.getClientRects()[0].right
            );
            const cursorX = event.clientX;

            if (cursorX > tableWrapperRightSide) {
                this.$refs[this.name + 'grip'].style.top = -500 + 'px';
                this.$refs[this.name + 'grip'].style.left = -500 + 'px';
                return;
            }
            if (!this.gripBottomLineHeight) {
                this.gripBottomLineHeight = this.$refs[
                    this.name + 'grip__bottomLine'
                ].style.height =
                    Math.round(
                        this.$refs[this.name + 'table-body'].offsetHeight
                    ) + 'px';
            }

            this.activeField = id.split('%%%')[0];

            if (this.type === 'modal') {
                const modalWindow = document.getElementById('payout-modal');
                this.modalExtraLeft = Math.round(
                    modalWindow.getBoundingClientRect().x
                );
                this.modalExtraTop = Math.round(
                    modalWindow.getBoundingClientRect().y
                );
            }

            this.$refs[this.name + 'grip'].style.top =
                Math.round(
                    document.getElementById(id).getBoundingClientRect().y
                ) -
                this.modalExtraTop +
                'px';
            this.$refs[this.name + 'grip'].style.left =
                Math.round(
                    document.getElementById(id).getBoundingClientRect().x +
                        document.getElementById(id).offsetWidth -
                        7
                ) -
                this.modalExtraLeft +
                'px';
        },
        onGripMouseDown () {
            const grip = this.$refs[this.name + 'grip'];
            document.addEventListener('mousemove', this.onGripMouseMove);
            this.gripCoordsBefore = Math.round(
                this.$refs[this.name + 'grip'].getBoundingClientRect().x -
                    this.modalExtraLeft
            );
            this.gripBottomLineActive = true;
        },
        onGripMouseMove (e) {
            if (!this.gripCoordsBefore && this.gripCoordsAfter) {return;}
            const target = event.target;
            const grip = this.$refs[this.name + 'grip'];
            grip.style.left = e.clientX - this.modalExtraLeft + 'px';
            this.gripCoordsAfter = Math.round(e.clientX);

            if (window.getSelection) {
                if (window.getSelection().empty) {
                    // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {
                    // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {
                // IE?
                document.selection.empty();
            }
        },
        onGripMouseUp () {
            if (!this.gripCoordsBefore) {return;}

            document.removeEventListener('mousemove', this.onGripMouseMove);
            const column = document.getElementById(
                this.activeField + '%%%' + 'column'
            );
            const minWidth = column.querySelector('span').offsetWidth + 60;
            const maxWidth = 200;
            let width =
                document.getElementById(this.activeField + '%%%' + 'column')
                    .offsetWidth +
                (this.gripCoordsAfter -
                    this.gripCoordsBefore -
                    this.modalExtraLeft) -
                1;

            if (width < minWidth) {
                width = minWidth;
            } else if (width > maxWidth) {
                width = maxWidth;
            }

            document.getElementById(
                this.activeField + '%%%' + 'column'
            ).style.width = `${width}px`;

            const rowsArr = Array.from(
                document.querySelectorAll(`#${this.activeField}_row_column`)
            );
            if (rowsArr.length) {
                rowsArr.forEach((el) => (el.style.width = `${width}px`));
            }
            this.gripCoordsBefore = null;
            this.gripCoordsAfter = null;

            setTimeout(() => {
                this.$refs[this.name + 'grip'].style.top = -500 + 'px';
            }, 200);
        },

        removeActiveGrip () {
            this.gripActive = false;
            this.gripScroll = false;
        },
        scroll (e) {
            this.$refs.thead.childNodes[0].style.left =
                '-' + e.target.scrollLeft + 'px';
            this.$refs.theadRow.style.left = '-' + e.target.scrollLeft + 'px';
        },
        calculateColumnsWidth () {
            return;
            if (!this.headerAlreadyRendered) {return;}
            this.showTotalRow = false;
            const wrapperWidth = document.querySelector('.'+this.name+'-table').offsetWidth;
            this.columnsWidth = [];
            const headers = document.querySelectorAll('.th');
            const shouldShrink = headers.length * 200 > wrapperWidth;
            let aimableWidth = wrapperWidth / headers.length;
            if (shouldShrink) {
                let oldAimableWidth;
                while (oldAimableWidth !== aimableWidth) {
                    oldAimableWidth = aimableWidth;
                    let countOfShrinkable = 0;
                    let totalMinWidth = 0;
                    Array.from(headers).forEach((el, i) => {
                        const minWidth = el.children[0].offsetWidth + 60;
                        if (aimableWidth >= minWidth) {
                            countOfShrinkable++;
                        } else {
                            totalMinWidth += minWidth;
                        }
                    });
                    aimableWidth = (wrapperWidth - totalMinWidth) / countOfShrinkable;
                }
            }
            Array.from(headers).forEach((el, i) => {
                const minWidth = el.children[0].offsetWidth + 60;
                const width = shouldShrink
                    ? aimableWidth >= minWidth
                        ? aimableWidth
                        : minWidth
                    : 200;
                this.columnsWidth.push(width);
                this.table.columns[i].width = width;
            });
            this.$nextTick(() => {
                this.showTotalRow = true;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.table-header-wrapper {
    position: relative;
    touch-action: none;
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 4px;
        width: 5px;
    }

    &::-webkit-scrollbar-thumb:hover,
    &::-webkit-scrollbar-thumb:active {
        background: #808080;
    }

    &::-webkit-scrollbar-thumb {
        background: #d4d4d4;
        border: 0;
        border-radius: 100px;
    }

    &::-webkit-scrollbar-track {
        background: #ffffff;
        border: 0px none;
        border-radius: 0px;
    }
}
.table-absolute-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
}
.ftable {
    position: fixed;
    top: 0;
}
.table-relat {
    position: relative;
    z-index: 3;
}
.table {
    background-color: #fff;
}
.thead {
    width: max-content;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 5;
    background: #f6f6f6;
    overflow: hidden;
}

.grid-footer > div {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    justify-content: space-between;
    font-size: 0.8em;
    font-weight: normal;
    text-transform: uppercase;
}

.grid-body {
    min-height: 100px;
    margin-top: 20px;
    border-radius: 4px;
    transition: all 0.2s;

    &.grid-body-mist {
        position: relative;
        overflow: hidden;
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            background-color: #ffffff;
            opacity: 0.6;
            z-index: 8;
            width: 100%;
            height: 100%;
        }
    }
}

.table {
    background-color: #fff;
    width: max-content;
    border-radius: 5px;
}

.th:last-child .grip {
    left: calc(100% - 5px);
}

.grip {
    position: fixed;
    top: -500;
    width: 5px;
    height: 63px;
    background-color: #007cd7;
    opacity: 1;
    left: calc(100% - 7px);
    z-index: 6;
    opacity: 0;
    cursor: col-resize;
}
.grip.grip-active {
    opacity: 1;
}

.grip__bottomLine {
    position: absolute;
    top: 100%;
    left: 2px;
    border-left: thin solid #007cd7;
    display: none;
    transition: all 0.2s;
}
.grip__bottomLine-active {
    display: block;
}

.grip.grip-active:before {
    display: block;
}
</style>
