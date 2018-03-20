<template>
  <canvas></canvas>
</template>

<script>
import * as THREE from 'three';
// import ResizeWatch from '../modules/comets/ResizeWatch';
import Webgl from '../modules/comets/WebGL';

function anotherFunction() {
  //
}

export default {
  name: 'Comets',
  props: ['data'],
  mounted() {
    this.data
    this.$el // canvas
    this.someFunction();
    anotherFunction();

    // this.resizeWatch = new ResizeWatch();
    this.webgl = new Webgl(this);
  },
  methods: {
    someFunction: function() {

    }
  }
}
</script>

<style scoped>
</style>
