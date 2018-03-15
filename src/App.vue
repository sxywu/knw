<template>
  <div>
    <Timeline :data='subtitles' />
    <Comets :data='subtitles'></Comets>
  </div>
</template>

<script>
import Timeline from './components/Timeline';
import Comets from './components/Comets';
import subtitles from './assets/gathered_data.csv';
export default {
  name: 'App',
  components: {
    Timeline,
    Comets,
  },
  data() {
    return {
      subtitles,
    };
  },
}
</script>

<style>
</style>
