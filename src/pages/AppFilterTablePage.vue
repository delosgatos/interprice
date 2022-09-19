<template>
  <div>
    <h1>Filter table page</h1>
    <code>{{ filters }}</code>
    <pre>{{ activeFilters }}</pre>
    <div>
        <v-btn-toggle
            v-model="activeFilters.Currency"
            rounded
            class="overflow-hidden"
            >
            <v-btn v-for="d in filters.Currency" :key="d.id">
                {{ d.id }}
            </v-btn>
        </v-btn-toggle>
        <v-btn-toggle
            v-model="activeFilters.Years"
            v-if="filters.Currency[activeFilters.Currency] && filters.Currency[activeFilters.Currency].years"
            rounded
            class="overflow-hidden"
            >
            <v-btn v-for="d in filters.Currency[activeFilters.Currency].years" :key="d">
                {{ d }}
            </v-btn>
        </v-btn-toggle>
        <v-btn-toggle
            v-model="activeFilters.Display"
            rounded
            class="overflow-hidden"
            >
            <v-btn v-for="d in filters.Display" :key="d.id">
                {{ d.id }}
            </v-btn>
        </v-btn-toggle>
    </div>
    <div class="filter-table">
      <app-table
        v-if="table"
        :name="table.name"
        :table="table"
        @getData="(payload) => getDataMethod(payload)"
        @sort="sort"
      />
    </div>
  </div>
</template>

<script>
import jsonData from '@/assets/data.json';

export default {
    name: 'AppFilterTablePage',
    components: {
        appTable: () => import('@/components/AppTable'),
    },
    data () {
        return {
            rawData: jsonData,
            sortedItems: [],
            quotes: [],
            filters: {
                Currency: [],
                Years: [],
                Display: [
                    { id: 'Spread',     },
                    { id: 'Yield',      },
                    { id: '3MLSpread',  },
                ]
            },
            activeFilters: {
                Currency: 0,
                Years: 0,
                Display: 0,
            }
        };
    },
    computed: {
        table () {
            const tableData = {
                columns: [ 
                    { show: true, field: 'date', label: 'DATE SENT', width: 200, sortable: true,  }, 
                    { show: true, field: 'name', label: 'COMPANY', width: 200, sortable: true,  }, 
                ], 
                rows: this.quotes.filter(val => this.filters.Currency.findIndex((f, i) => this.activeFilters.Currency === i && f.id === val.Currency) !== -1), 
                name: 'InterPrice', 
            };
            return tableData;
        },
    },
    watch: {
        'activeFilters.Currency': function(newVal, oldVal) {
            this.updateFilters();
        }
    },
    mounted () {
        this.parseDataForFilters();
    },
    methods: {
        parseDataForFilters () {
            let i = 1;
            this.quotes = this.rawData.Items.reduce((prev, curr) => prev.concat((curr.Quote || [ {} ]).map((val) => { return { ...val, itemId: curr.Id, id:i++, date: this.convertDate(curr.DateSent), name: curr.Company, preffered: curr.Preferred, }; })), []);
            this.quotes.forEach((val, i) => {
                if (val.Currency && !this.filters.Currency.find(c => c.id === val.Currency)) {
                    const years = this.quotes.filter(q => q.Currency === val.Currency).reduce((prev, curr) => curr.Years && !prev.includes(curr.Years) ? [ ...prev, curr.Years, ] : prev, []);
                    this.filters.Currency.push({ id: val.Currency, years: years });
                    console.log('curr usd', val.Currency)
                    //this.activeFilters.Years.push(0);
                    if (val.Currency === 'USD') {
                        this.activeFilters.Currency = i;
                    }
                }
            });
            this.updateFilters();
            console.log('QUOTES', this.quotes);
            console.log('FILTERS', this.filters);
            console.log('ACTIVE FILTERS', this.activeFilters);
        },
        updateFilters () {
            console.log('ACTIVE FILTERS CURRENCY', this.activeFilters.Currency)
            this.filters.Years = this.filters.Currency[this.activeFilters.Currency] ? this.filters.Currency[this.activeFilters.Currency].years : [];
            this.$nextTick(() => {
                this.activeFilters.Years = 0;
            });
        },
        convertDate (dateString) {
            return !dateString ? null : (new Date(dateString)).getTime();
        },
        sort (sortedItems) {
            this.sortedItems = sortedItems;
            this.getDataMethod(sortedItems);
        },
        getDataMethod (payload = {}) {
            return this.rawData.Items;
        },
    }
};
</script>

<style scoped>
    h1  {
        color: green;
    }
</style>