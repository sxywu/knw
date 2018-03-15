<template>
  <div>
    <svg :width='width' :height='height'>
      <g id='timeline'>
        <rect v-for='d in timelineData' :fill='d.color'
          :x='d.x1' y='20' :width='d.x2 - d.x1' height='20'
          @mouseover='hoverLine(d)'></rect>
      </g>
    </svg>
    <div>
      {{ hoveredLine }}
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import _ from 'lodash';
import {toMS} from 'subtitle';

const margins = {top: 20, right: 20, bottom: 20, left: 20};

export default {
  name: 'Timeline',
  props: ['data'],
  data() {
    return {
      width: window.innerWidth,
      height: 60,
      hoveredLine: '',
    };
  },
  computed: {
    timelineData: function() {
      this.xScale = d3.scaleLinear().range([0, this.width]);
      _.each(this.data, d => Object.assign(d, {
        startTime: toMS(d.startTime),
        endTime: toMS(d.endTime),
      }));
      this.xScale.domain([this.data[0].startTime, _.last(this.data).endTime]);

      return _.map(this.data, d => {
        let color = '#999';
        if (_.includes(d.Character, 'みつは')) {
          color = 'rgb(230, 143, 195)';
        } else if (_.includes(d.Character, 'たき')) {
          color = 'rgb(81, 170, 232)';
        }
        return {
          x1: this.xScale(d.startTime),
          x2: this.xScale(d.endTime),
          color,
          text: `${d.Character}: ${d.text}`,
        }
      });
    }
  },
  methods: {
    hoverLine(d) {
      this.hoveredLine = d.text;
    }
  }
}
</script>

<style scoped>
  #timeline rect {
    cursor: pointer;
  }
</style>
