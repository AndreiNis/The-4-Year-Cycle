
import { select, csv, scaleLinear, max, scaleBand, axisLeft, timeFormat } from 'd3';

const svg = select('#root-svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.price;
    const yValue = d => d.snapped_at;
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const margin2 = { top: 430, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom - margin.top;

    const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);
        
    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight]);
        
    const yAxis = axisLeft(yScale);

    const g = svg.append('g')
        .attr('transform', `translate(${ margin.left }, ${ margin.top })`);

    yAxis(g.append('g'));

    g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());
};

csv('./data/btc-usd-max.csv').then(data => {
    data.forEach(d => {
        d.price = +d.price;
        d.market_cap = +d.market_cap;
        d.total_volume = +d.total_volume;
    });
    render(data);
});


