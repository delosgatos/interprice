<template>
  <div>
    <div style="margin-bottom: 20px">
      <v-btn-toggle
        v-model="activeFilters.Currency"
        dense
        mandatory
        class="overflow-hidden mr-5 group-button"
        color="#527094"
        background-color="#fff"
        ref="CurrencyControl"
      >
        <v-btn v-for="d in filters.Currency" :key="d.id">
          {{ d.id }}
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle
        v-model="activeFilters.Years"
        v-if="
          filters.Currency[activeFilters.Currency] &&
          filters.Currency[activeFilters.Currency].years
        "
        multiple
        dense
        mandatory
        class="overflow-hidden mr-5 group-button"
        color="#527094"
        background-color="#fff"
        ref="YearsControl"
      >
    <v-btn v-for="(d,i) in filters.Years" :key="d+'-'+filters.Currency[activeFilters.Currency].id">
          {{ d }} {{ i }} YRS
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle
        v-model="activeFilters.Display"
        dense
        mandatory
        class="overflow-hidden group-button"
        color="#527094"
        background-color="#fff"
        ref="DisplayControl"
      >
        <v-btn v-for="d in filters.Display" :key="d.id">
          {{ d.id }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <div class="filer-input" style="width: 37%">
      <v-text-field
        v-model="activeFilters.Company"
        placeholder="Filter by company name ..."
        outlined
        dense
        hide-details="auto"
      ></v-text-field>
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
import jsonData from "@/assets/data.json";

export default {
  name: "AppFilterTablePage",
  components: {
    appTable: () => import("@/components/AppTable"),
  },
  data() {
    return {
      rawData: jsonData,
      sortedItems: null,
      quotes: [],
      filters: {
        Currency: [],
        Years: [],
        Display: [{ id: "Spread" }, { id: "Yield" }, { id: "3MLSpread" }],
      },
      activeFilters: {
        Currency: 0,
        Years: [],
        Display: 0,
        Company: "",
      },
    };
  },
  computed: {
    table() {
      return this.getDataMethod();
    },
    filterYears() {
      return this.filters.Currency[this.activeFilters.Currency]
        ? this.filters.Currency[this.activeFilters.Currency].years
        : [];
    },
    activeDisplay() {
      return this.filters.Display[this.activeFilters.Display].id;
    },
    activeCurrency() {
      return this.filters.Currency[this.activeFilters.Currency].id;
    },
    activeYears() {
      return this.activeFilters.Years.map((yi) => this.filterYears[yi]);
    },
  },
  watch: {
    "activeFilters.Currency": {
      handler (newVal, oldVal) {
        this.updateYears();
      },
    },
  },
  mounted() {
    this.parseDataForFilters();
  },
  methods: {
    parseDataForFilters() {
      let i = 1;
      this.quotes = this.rawData.Items.reduce(
        (prev, curr) =>
          prev.concat(
            (curr.Quote || [{}]).map((val) => {
              return {
                ...val,
                itemId: curr.Id,
                id: i++,
                date: this.convertDate(curr.DateSent),
                name: curr.Company,
                preferred: parseInt(curr.Preferred),
                hasData: !!curr.Quote,
              };
            })
          ),
        []
      );
      this.quotes.forEach((val, i) => {
        if (val.Currency && !this.filters.Currency.find((c) => c.id === val.Currency)) {
          const years = this.quotes
            .filter((q) => q.Currency === val.Currency)
            .reduce(
              (prev, curr) =>
                curr.Years && !prev.includes(parseInt(curr.Years)) ? [...prev, parseInt(curr.Years)] : prev,
              []
            );
          this.filters.Currency.push({ id: val.Currency, years: years.map(y=>parseInt(y)).sort((a,b) => parseInt(b) < parseInt(a) ? 1 : (b === a ? 0 : -1))});
          if (val.Currency === "USD") {
            this.activeFilters.Currency = i;
          }
        }
      });
      this.updateYears();
    },
    updateYears() {
        this.filters.Years = [];
        this.$nextTick(()=>{
            this.activeFilters.Years = [0];
            this.filters.Years = this.filters.Currency[this.activeFilters.Currency].years;
        });
    },
    convertDate(dateString) {
      return !dateString ? null : new Date(dateString).getTime();
    },
    sort(sortedItems) {
      this.sortedItems = sortedItems;
    },
    getDataMethod(payload = {}) {
      const tableData = {
        columns: [
          [
            {
              show: true,
              field: ">",
              label: " ",
              width: 30,
              sortable: false,
              rowspan: 2,
            },
            {
              show: true,
              field: "date",
              label: "DATE SENT",
              width: 80,
              sortable: true,
              rowspan: 2,
              thClass: "text-left",
            },
            {
              show: true,
              field: "name",
              label: "COMPANY",
              width: 200,
              sortable: true,
              rowspan: 2,
              thClass: "text-left",
            },
          ],
          [],
        ],
        rows: this.quotes.filter((val) => {
          val.filtered = new RegExp(this.activeFilters.Company, "i").test(val.name);
          return (
            (this.filters.Currency.findIndex(
              (f, i) => this.activeFilters.Currency === i && f.id === val.Currency
            ) !== -1 &&
              this.activeYears.includes(val.Years) &&
              val.filtered) ||
            (!val.hasData && !this.activeFilters.Company) ||
            val.filtered
          );
        }),
        name: "InterPrice",
      };
      this.activeYears.forEach((y) => {
        tableData.columns[0].push({
          show: true,
          field: y,
          label: y + " YRS",
          width: 100,
          sortable: false,
          colspan: 2,
          thClass: "text-сenter",
        });
        tableData.columns[1].push({
          show: true,
          group: y,
          field: "FIX_" + y,
          label: "FIX",
          width: 50,
          sortable: false,
          thClass: "text-сenter",
        });
        tableData.columns[1].push({
          show: true,
          group: y,
          field: "FRN_" + y,
          label: "FRN",
          width: 50,
          sortable: false,
          thClass: "text-сenter",
        });
      });
      const minColumns = {};
      const minColumnsIndex = {};
      const sumColumns = {},
        averageRow = {
          name: "Average by " + this.activeDisplay,
          Display: this.activeDisplay,
          type: "total",
        };
      tableData.rows = tableData.rows
        .map((r, ir) => {
          r = { ...r };
          if (r.CouponType && r.Years && r.Currency === this.activeCurrency) {
            r.Display = this.activeDisplay;
            let newField = r.CouponType + "_" + r.Years;
            r[newField] = r[r.Display] === null ? null : Number(r[r.Display]);
            if (r.CouponType === "FIX") {
              const minField = newField;
              if (!minColumns[minField] && r[newField] !== null) {
                minColumns[minField] = { val: r[newField], id: r.id };
              } else if (r[newField] !== null && minColumns[minField].val > r[newField]) {
                minColumns[minField] = { val: r[newField], id: r.id };
              }
            }
            if (r[newField] !== null) {
              if (!sumColumns[newField]) {
                sumColumns[newField] = { sum: 0, count: 0 };
              }
              sumColumns[newField].sum += r[newField];
              sumColumns[newField].count++;
            }
            r.groups = [];
            this.filters.Display.forEach((d) => {
              r.groups.push({
                type: "subdata",
                name: d.id,
                value: r[d.id],
                [`${newField}`]: r[d.id],
                Display: d.id,
                Currency: r.Currency,
                Amount: r.Amount,
              });
            });
          }
          if (ir === tableData.rows.length - 1) {
            Object.keys(minColumns).forEach((mc) => {
              minColumnsIndex[minColumns[mc].id] = mc;
            });
          }
          return r;
        })
        .reduce((o, n, ni) => {
          if (!n) {
            return o;
          }
          if (minColumnsIndex[n.id]) {
            n[minColumnsIndex[n.id] + "_MIN"] = true;
          }
          if (!o.length || !n.itemId) {
            o.push({ ...n });
          } else {
            const ol = o[o.length - 1];
            if (ol.name.toUpperCase() === n.name.toUpperCase()) {
              if (n.groups) {
                n.groups.forEach((g, ig) => {
                  if (!ol.groups) {
                    return;
                  }
                  n.groups[ig] = Object.assign({}, ol.groups[ig], g);
                });
              }
              Object.assign(ol, n);
              return o;
            } else {
              o.push({ ...n });
            }
          }
          return o;
        }, new Array())
        .sort((a, b) => {
          if (!this.sortedItems || this.sortedItems.date) {
            if (!this.sortedItems || this.sortedItems.date !== "asc") {
              if (
                a.date < b.date ||
                (a.date === b.date && a.preferred < b.preferred) ||
                (a.date === b.date && a.preferred === b.preferred && a.name > b.name)
              ) {
                return 1;
              }
            } else {
              if (
                a.date > b.date ||
                (a.date === b.date && a.preferred > b.preferred) ||
                (a.date === b.date && a.preferred === b.preferred && a.name < b.name)
              ) {
                return 1;
              }
            }
            if (a.date === b.date && a.preferred === b.preferred && a.name === b.name) {
              return 0;
            }
            return -1;
          }
          if (this.sortedItems.name) {
            if (this.sortedItems.name !== "asc") {
              if (
                a.name > b.name ||
                (a.name === b.name && a.date < b.date) ||
                (a.name === b.name && a.date === b.date && a.preferred < b.preferred)
              ) {
                return 1;
              }
            } else {
              if (
                a.name < b.name ||
                (a.name === b.name && a.date > b.date) ||
                (a.name === b.name && a.date === b.date && a.preferred > b.preferred)
              ) {
                return 1;
              }
            }
            if (a.name === b.name && a.date === b.date && a.preferred === b.preferred) {
              return 0;
            }
            return -1;
          }
        });
      Object.keys(sumColumns).forEach((field) => {
        const avg = sumColumns[field].sum / sumColumns[field].count;
        let minDiff = null,
          iDiff = null;
        tableData.rows.forEach((r, ir) => {
          if (!r[field]) {
            return;
          }
          if (minDiff === null) {
            minDiff = avg + Number(r[field]);
          }
          const diff = Math.abs(avg - Number(r[field]));
          if (diff < minDiff) {
            minDiff = diff;
            iDiff = ir;
          }
        });
        if (iDiff !== null) {
          averageRow[field] = tableData.rows[iDiff][field];
        }
      });
      tableData.rows.push(averageRow);
      return tableData;
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  color: green;
}
.group-button {
}
</style>
<style lang="scss">
.theme--light {
  &.v-btn-toggle {
    & > .v-btn {
      &:not(.v-btn-toggle--group) {
        &.v-btn {
          &.v-btn {
            color: $main-color;
            background-color: #fff;
            font-size: 12px;
            font-weight: normal;
            border-color: $main-color !important;
            height: 32px;
          }
          &.v-btn--active {
            color: #fff;
            background-color: $main-color;
            border-left-color: rgba(255, 255, 255, 1) !important;
            border-right-color: rgba(255, 255, 255, 1) !important;
            &:first-child {
              border-left-color: $main-color !important;
            }
            &:last-child {
              border-right-color: $main-color !important;
            }
          }
        }
      }
    }
  }
  &.v-text-field--outlined.v-input--dense.v-text-field--outlined
    > .v-input__control
    > .v-input__slot {
    min-height: 32px;
    font-size: 14px;
  }
}
</style>
