import Node from './Node'

class RuleData {
  constructor (data) {
    let node = new Node(data)
    this._root = node
  }
}

export default RuleData
