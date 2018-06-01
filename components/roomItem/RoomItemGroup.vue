<template>
    <div class="room-item-group">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'roomItem',
    componentName: 'RoomItemGroup',
    props: {
      value: {}
    },
    created () {
    },
    methods: {}
  }
</script>

<style scoped>
    .room-item-group {
        display: table;
        width: 100%;
        box-sizing: border-box;
    }
</style>