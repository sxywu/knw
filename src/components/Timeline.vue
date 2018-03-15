<template>
  <div>
    <svg :width='width' :height='height'>
      <g id='timeline'>
        <rect v-for='d in sceneData' fill='#cfcfcf' stroke='#666' stroke-width='0.5'
          :x='d.x1' y='40' :width='d.x2 - d.x1' height='20'
          @mouseover='hoverLine(d)'></rect>
        <rect v-for='d in timelineData' :fill='d.color'
          :x='d.x1' y='20' :width='d.x2 - d.x1' height='20'
          @mouseover='hoverLine(d)'></rect>
      </g>
    </svg>
    <div>
      <h3>{{ hovered.Character || hovered.scene}}</h3>
      <div v-for='t in hovered.text'>{{ t }}</div>
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
      hovered: {},
    };
  },
  computed: {
    timelineData: function() {
      const data = []; // final timeline data
      let prev = null;
      _.each(this.data, d => {
        Object.assign(d, {
          startTime: toMS(d.startTime),
          endTime: toMS(d.endTime),
        });
        if (prev && d.Character === prev.Character && d.startTime - prev.endTime < 1000) {
          // if same character speaking AND it's within same second
          // then append it to previous line
          prev.endTime = d.endTime;
          prev.text.push(d.text);
        } else {
          // if first line, or different character speaking
          d.text = [d.text];
          data.push(d);
          prev = d;
        }
      });

      this.xScale = d3.scaleLinear().range([0, this.width]);
      this.xScale.domain([this.data[0].startTime, _.last(this.data).endTime]);

      return _.map(data, d => {
        let color = '#999';
        if (_.includes(d.Character, 'みつは')) {
          color = 'rgb(230, 143, 195)';
        } else if (_.includes(d.Character, 'たき')) {
          color = 'rgb(81, 170, 232)';
        }
        return Object.assign(d, {
          x1: this.xScale(d.startTime),
          x2: this.xScale(d.endTime),
          color,
        });
      });
    },
    sceneData: function() {
      const scenes = [];
      let prev = null;
      _.each(this.timelineData, d => {
        // if it's the same Time, save to previous
        if (prev && d.Time === prev.scene) {
          prev.endTime = d.endTime;
        } else {
          d = {
            startTime: d.startTime,
            endTime: d.endTime,
            scene: d.Time,
          };
          scenes.push(d);
          prev = d;
        }
      });

      return _.map(scenes, d => Object.assign(d, {
        x1: this.xScale(d.startTime),
        x2: this.xScale(d.endTime),
      }));
    }
  },
  methods: {
    hoverLine(d) {
      this.hovered =  d;
    }
  }
}
</script>

<style scoped>
  #timeline rect {
    cursor: pointer;
  }
</style>
