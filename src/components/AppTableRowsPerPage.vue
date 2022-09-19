<template>
  <div class="rows-per-page">
    <div class="rows-per-page__title">
      {{ perPageTitle }}
    </div>
    <div class="rows-per-page-select__wrapper">
      <select
        v-model="perPage"
        class="rows-per-page-select"
        @change="onPerPageChange"
      >
        <option
          v-for="(item, i) in rowsPerPage"
          :key="i"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
      <svg
        class="rows-per-page-select__arrow"
        width="10"
        height="7"
        viewBox="0 0 10 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1.63379L5 5.63715L9 1.63379"
          stroke="#D4D4D4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        perPage: {
            type: Number,
            default: 10,
        },
        perPageTitle: {
            type: String,
        },
    },
    data () {
        return {
            rowsPerPage: [ 10, 20, 50, 100 ],
        };
    },
    methods: {
        onPerPageChange () {
            const params = {
                currentPerPage: this.perPage,
            };
            this.$emit('on-per-page-change', params);
        },
    },
};
</script>

<style lang="scss" scoped>
.rows-per-page {
    display: flex;
    width: max-content;
    min-width: max-content;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #808080;
    margin-right: 20px;
    &__title {
        margin-right: 13px;
    }
    .rows-per-page-select {
        width: 76px;
        height: 32px;
        border: 1px solid #ececec;
        box-sizing: border-box;
        border-radius: 5px;
        padding-left: 16px;
        color: #4d4d4d;
        cursor: pointer;
        transition: opacity 0.3s;
        &:hover {
            opacity: 0.7;
        }
        &:focus {
            //border: 1px solid #007cd7 !important;
            outline: none;
        }
        &__wrapper {
            position: relative;
        }
        &__arrow {
            position: absolute;
            right: 20px;
            top: 12px;
            pointer-events: none;
        }
    }
}
.creativesModeration-table {
    .rows-per-page__title {
        display: none;
    }
    .rows-per-page {
        position: absolute;
        left: 0;
    }
}
</style>
