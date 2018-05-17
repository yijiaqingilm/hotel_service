import { Layout, Bed } from 'lib/base'
let attrMixins = {
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    removeLayout (layout) {
      let index = this.attr.layouts.indexOf(layout)
      if (index !== -1) {
        this.attr.layouts.splice(index, 1)
      }
    },
    addLayout () {
      this.attr.layouts.push(new Layout())
    },
    addBed () {
      this.attr.beds.push(new Bed())
    },
    removeBed (bed) {
      let index = this.attr.beds.indexOf(bed)
      if (index !== -1) {
        this.attr.beds.splice(index, 1)
      }
    }
  }
}
export default attrMixins
