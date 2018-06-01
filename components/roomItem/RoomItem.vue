<template>
    <label class="room-item" :class="[{'is-checked':isChecked}]">
        <input
                v-if="trueLabel || falseLabel"
                type="checkbox"
                v-model="model"
                :true-value="trueLabel"
                :false-value="falseLabel"
                test="truelabel"
                class="el-checkbox-button__original"
                :name="name">

        <input
                else
                type="checkbox"
                v-model="model"
                :value="label"
                test="label"
                class="el-checkbox-button__original"
                :name="name">
        <span>
            <slot></slot>
            <template v-if="!$slots.default">{{label}}</template>
        </span>
    </label>
</template>

<script>
  export default {
    name: 'room-item',
    componentName: 'RoomItem',
    props: {
      label: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      value: {},
      checked: Boolean,
      disabled: Boolean,
      name: String,
    },
    data () {
      return {
        _checkboxGroup: null,
        selfModel: false
      }
    },
    methods: {
      addToStore () {
        if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
          this.model.push(this.label)
        } else {
          this.model = this.trueLabel || true
        }
      },
    },
    computed: {
      model: {
        get () {
          return this.isGroup
            ? this._checkboxGroup.value : this.value !== undefined
              ? this.value : this.selfModel
        },
        set (val) {
          if (this.isGroup) {
            this._checkboxGroup.$emit('input', val)
          } else {
            this.$emit('input', val)
            this.selfModel = val
          }

        }
      },
      isGroup () {
        let parent = this.$parent
        if (parent.$options.componentName === 'RoomItemGroup') {
          this._checkboxGroup = parent
          return true
        } else {
          return false
        }
      },
      isChecked () {
        if (Object.prototype.toString.call(this.model) === '[object Boolean]') {
          return this.model
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) !== -1
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel
        }
      }
    },
    created () {
      this.checked && this.addToStore()
    }
  }
</script>

<style scoped>
    .room-item {
        position: relative;
        cursor: pointer;
        border: 1px solid red;
        padding: 20px 30px;
        border-radius: 14px;
        width: 20%;
        float: left;
    }
</style>