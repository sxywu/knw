<template>
  <Timeline :data='subtitles' />
</template>

<script>
import Timeline from './components/Timeline';
import subtitles from './assets/gathered_data.csv';
export default {
  name: 'App',
  components: {
    Timeline,
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
