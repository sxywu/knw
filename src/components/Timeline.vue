<template>
  <div>
    <svg :width='width' :height='height' style='overflow:visible'>
      <g id='links'>
        <path v-for='d in links' :d='d.path' :fill='d.color'
          fill-opacity='0.25' stroke='#666' stroke-width='0.25'></path>
      </g>
      <g id='timeline'>
        <rect v-for='d in sceneData' :fill='d.color'
          fill-opacity='0.75' stroke='#666' stroke-width='0.5'
          :x='d.x1' y='40' :width='d.x2 - d.x1' height='20'
          @mouseover='hoverLine(d)'></rect>
        <rect v-for='d in timelineData' :fill='d.color'
          :x='d.x1' y='20' :width='d.x2 - d.x1' height='20'
          @mouseover='hoverLine(d)'></rect>
      </g>
      <g id='splitTimeline' transform='translate(0, 320)'>
        <g v-for='(dates, i) in splitTimeline' :transform='`translate(0, ${i * 30})`'>
          <g v-for='date in dates' :transform='`translate(${date.x}, 0)`'>
            <rect v-for='d in date.scenes' :fill='d.color'
              fill-opacity='0.75' stroke='#666' stroke-width='0.5'
              :x='d.x1' :width='d.x2 - d.x1' height='20'
              @mouseover='hoverLine(d)'></rect>
          </g>
        </g>
        <g ref='dates'></g>
      </g>
      <g id='plots'>
        <text v-for='d in plotData' :x='d.x' :y='d.y' :fill='d.color'
          text-anchor='middle' @mouseover='hoverLine(d)'>*</text>
      </g>
    </svg>
    <div>
      <h3>{{ hovered.plot || hovered.Character || hovered.scene}}</h3>
      <div v-for='t in hovered.text'>{{ t }}</div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import _ from 'lodash';
import {toMS} from 'subtitle';
import {annotation, annotationLabel} from 'd3-svg-annotation';

const margins = {top: 20, right: 20, bottom: 20, left: 20};
const makeAnnotations = annotation().type(annotationLabel);
// function linkVertical(d) {
//   const [x1, y1] = d.source;
//   const [x2, y2] = d.target;
//   return `M${[x1, y1]} C${[x1, (y1 + y2) / 2]} ${[x2, (y1 + y2) / 2]} ${[x2, y2]}`;
// }
const linkVertical = d3.linkVertical();

export default {
  name: 'Timeline',
  props: ['data'],
  data() {
    return {
      width: window.innerWidth - 16,
      height: 600,
      timelineData: [],
      sceneData: [],
      splitTimeline: [],
      plotData: [],
      links: [],
      hovered: {},
    };
  },
  mounted() {
    this.calculateTimeline();
    this.calculateScenes();
    this.calculateSplitTimeline();
    this.calculateLinks();
    this.calculatePlots();

    makeAnnotations.annotations(this.splitDates);
    d3.select(this.$refs.dates).call(makeAnnotations);
  },
  methods: {
    calculateTimeline: function() {
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

      this.timelineData = _.map(data, d => {
        let color = '#999';
        if (d.Character === 'みつは') {
          color = 'rgb(230, 143, 195)';
        } else if (d.Character === 'たき') {
          color = 'rgb(81, 170, 232)';
        }
        return Object.assign(d, {
          x1: this.xScale(d.startTime),
          x2: this.xScale(d.endTime),
          color,
        });
      });
    },
    calculateScenes: function() {
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

      this.sceneData = _.map(scenes, (d, i) => {
        let color = '#999';
        if (_.includes(d.scene, 'Past 2')) {
          color = 'rgb(230, 143, 195)';
        } else if (_.includes(d.scene, 'Past 1')) {
          color = 'rgb(81, 170, 232)';
        } else if (d.scene === 'Twilight') {
          color = 'yellow';
        }
        return Object.assign(d, {
          id: i,
          x1: this.xScale(d.startTime),
          x2: this.xScale(d.endTime),
          color,
        });
      });
    },
    calculateSplitTimeline: function() {
      const dateWidths = {}; // remember the dates' width
      const split = {'Past 1': {}, 'Past 2': {}, 'Past 2B': {}};
      _.chain(this.sceneData)
        .map(d => {
          let [time, date] = d.scene.split(', ');
          if (_.includes(time, 'Flashback')) {
            time = time.split(' // ')[1];
          }
          if (!split[time] || !date) return;
          return Object.assign(d, {time, date});
        }).filter()
        .sortBy(d => new Date(d.date))
        .each(d => {
          let times = split[d.time][d.date];
          if (!times) {
            times = split[d.time][d.date] = {scenes: []};
          }
          const scenes = times.scenes;
          // where this date should start
          const x1 = scenes.length ? _.last(scenes).x2 : 0;
          const x2 = x1 + (d.x2 - d.x1); // add the width in
          scenes.push({
            id: d.id,
            color: d.color,
            scene: d.scene,
            x1, x2,
          });
          dateWidths[d.date] = Math.max(x2, dateWidths[d.date] || 0);
        }).value();

      // for annotation
      const timelineHeight = 30;
      let x = 0;
      let i = -1;
      this.splitDates = _.map(dateWidths, (width, date) => {
        const a = {
          note: {label: date, align: 'left'},
          x, y: 0,
          dx: 0, dy: _.size(split) * timelineHeight + (i % 4) * 16,
        }
        dateWidths[date] = x;
        x += width + 10;
        i += 1;
        return a;
      });

      this.splitTimeline = _.chain(split)
        .map((dates, time) => {
          return _.map(dates, (d, date) => Object.assign(d, {
            x: dateWidths[date],
          }));
        }).value();
    },
    calculateLinks() {
      const sourceTop = 60;
      const targetTop = 320;
      const links = [];
      _.each(this.splitTimeline, (dates, i) => {
        _.each(dates, date => {
          _.each(date.scenes, target => {
            const source = _.find(this.sceneData, d => d.id === target.id);
            let path = linkVertical({
              source: [source.x1, sourceTop],
              target: [date.x + target.x1, targetTop + i * 30],
            });
            const x1 = date.x + target.x2;
            const y1 = targetTop + i * 30;
            path += `L${[x1, y1]}`;
            path += linkVertical({
              source: [x1, y1],
              target: [source.x2, sourceTop],
            }).replace(`M${[x1, y1]}`, '');
            path += 'Z';

            links.push({path, color: target.color, scene: target.scene});
          });
        })
      });
      this.links = links;
    },
    calculatePlots() {
      this.plotData = _.chain(this.data)
        .filter(d => _.includes(d['Plot arc'].toLowerCase(), 'memory') ||
          _.includes(d['Plot arc'].toLowerCase(), 'string'))
        .map(d => {
          const memory = _.includes(d['Plot arc'].toLowerCase(), 'memory');
          return {
            plot: d['Plot arc'],
            x: d.x1, y: memory ? 10 : 20,
            color: memory ? 'rgb(81, 170, 232)' : 'rgb(230, 143, 195)',
          };
        })
        .value();
    },
    hoverLine(d) {
      this.hovered =  d;
    }
  }
}
</script>

<style scoped>
  rect, #plots text {
    cursor: pointer;
  }
  tspan {
    font-size: 14px;
  }
</style>
