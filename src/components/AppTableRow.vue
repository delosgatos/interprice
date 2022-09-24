<template>
  <Fragment name="body" v-if="row">
    <tr 
        v-for="(subrow, sri) of subrows"
        :key="row.id + '_' + sri"
        :class="{
            'inactive': !subrow.hasData && subrow.type !== 'subdata' && subrow.type !== 'total',
            'subrow': subrow.type === 'subdata',
            'total': subrow.type === 'total',
            'mainrow': subrow.type !== 'subdata',
        }"
        role="rowgroup"
        ref="trRow"
    >
        <td
            v-for="(columnKey, index) of columnsKeyOrder"
            :class="[
                customClasses(columnKey), 
                name + '_' + columnKey + '_row_column',
                !!subrow[columnKey+'_MIN'] ? 'min-value' : '',
            ]"
            :key="columnKey + '_' + row.id + '_' + sri + '_' + index"
            :ref="columnKey"
            :style="{
                
            }"
            role="cell"
        >
            <div v-if="columnKey === 'date'" class="justify-start d-flex">
                {{ subrow[columnKey] | shortWordDate }}
            </div>
            <div v-else-if="columnKey === 'name'" class="justify-start d-flex">
                {{ subrow[columnKey] }}
            </div>
            <div v-else-if="columnKey === '>'" class="folded">
                <a  v-if="subrow.hasData" 
                    href="#" 
                    @click.prevent="foldedToggle()"
                >
                    <v-icon v-if="folded">mdi-menu-right</v-icon>
                    <v-icon v-if="!folded">mdi-menu-down</v-icon>
                </a>
            </div>
            <div v-else-if="(subrow.Currency || subrow.type === 'total') && (subrow.Display === 'Spread' || subrow.Display === '3MLSpread')">
                <span v-if="parseInt(subrow[columnKey]) > 0">
                    +{{ subrow[columnKey] }}bp
                </span>
                <span v-else-if="parseInt(subrow[columnKey]) < 0">
                    -{{ subrow[columnKey] }}bp
                </span>
            </div>
            <div v-else-if="(subrow.Currency || subrow.type === 'total') && subrow[columnKey]">
                {{ Number(subrow[columnKey]).toFixed(3) }}%
            </div>
        </td>
    </tr>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-frag';

export const customClasses = (field) => {
    const typeClasses = ((field) => {
        switch (field) {
            // left
            case 'name': 
            case 'date': 
                return 'td-text-left';
            // right
            //case 'date': return 'td-text-right';
            default:
                return 'td-text-center';
        }
    })(field);
    return typeClasses;
};

const customWidth = ({ field, name }) => {
    switch (field) {
        case 'date':                    return 80;
        case 'name':                    return 200;
        default:                        return 150;
    }
};


export default {
    components: {
        Fragment
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
        sortParams: {
            type: Object,
        }
    },
    data () {
        return {
            folded: true,
            addrows: [],
        };
    },
    
    computed: {
        subrows () {
            return [this.row, ...this.addrows];
        },
        Display: {
            cache: false,
            get: function () {
                return this.row.Display;
            }
        }
    },

    watch: {
        'row': { 
            handler (newVal, oldVal) {
                this.addrows = [];
                if(!this.folded) {
                    this.updateDisplay();
                }
            },
        },
        sortParams (newVal, oldVal) {
            this.folded = true;
            this.addrows = [];
        },
    },

    methods: {
        customClasses,

        foldedToggle () {
            this.folded = !this.folded;
            this.addrows = [];
            if(!this.folded) {
                this.updateDisplay();
            }
        },
        updateDisplay () {
            this.addrows = [];
            if(!this.row.groups){
                return false;
            }
            this.row.groups.forEach((g, gi) => {
                if (g.name === this.row.Display) {
                    return;
                }
                this.addrows.push(g);
            });
        },
    },
};
</script>

<style lang="scss">

    tr {
        transition: all 0.2s;
        border-top: 1px solid $table-border;
        &:hover {
            background-color: $table-row-bg-hover !important;
            .text-blue {
                color: $active-text;
            }
        }
        &:nth-child(even) {
            background: $table-row-bg-even;
        }
        &:nth-child(odd) {
            background: $table-row-bg-odd;
        }
        &.inactive {
            color: $inactive-text;
        }
        &:first-child {
            border-top: 0;
        }
        &.mainrow {
            td.InterPrice_name_row_column {
                font-weight: bold;
            }
        }
        &.subrow {
            
        }
        &.total {
            border: 1px solid $table-header-border;
            td.InterPrice_name_row_column {
                font-weight: normal;
            }
        }
    }

    td {
        border: 0;
        padding: 0.5em 0.2em;
        &.td-text-center {
            text-align: center;
        }
        &.td-text-right {
            text-align: right;
        }
    }
    .folded {
        a {
            text-decoration: none;
        }
    }
    .min-value {
        background: #F4F2D9;
    }

    @media only screen and (max-width: $size_mobile) {
        td {
            width: auto;
            display: block;
            border: 0;
            border-left: solid 1px $table-border;
            border-right: solid 1px $table-border;
            border-bottom: solid 1px $table-border;
        }
        .flex-row {
            width: 100%;
        }
    }
</style>
