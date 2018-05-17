class Layout {
  constructor (name = '', quantity = 1) {
    this.quantity = quantity
    this.name = name
  }
}

class Bed {
  constructor (name = '', quantity = 1, width, length) {
    this.name = name
    this.quantity = quantity
    this.width = width
    this.height = length
  }
}

export {
  Layout,
  Bed
}
