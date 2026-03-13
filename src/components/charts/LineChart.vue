<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
const props = defineProps(['lineChartDataX', 'lineChartDataY', 'isLoading', 'loadingOptions'])
use([CanvasRenderer, LineChart, GridComponent]);

const lineChartOptions = computed(() => ({
    title: {
        text: "Portfolio Performance Last 2 Years",
        left: "center",
        textStyle: {
            color: "#ffffff",
            fontSize: 24,              // Etwas größer
            fontWeight: 600,           // Schön fett (Bold)
            fontFamily: "Monaco, sans-serif", // Nutze eine moderne Sans-Serif
            lineHeight: 30
        },
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f2937',
        textStyle: { color: '#fff' },
        formatter: (params) => {
            const data = params[0];
            return `${data.name}<br/><b>$${data.value.toLocaleString()}</b>`;
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.lineChartDataX,
        axisLine: { lineStyle: { color: '#444' } }
    },
    yAxis: {
        type: 'value',
        scale: true, // Startet nicht bei 0, besser für Krypto-Preise
        axisLabel: {
            formatter: (val) => `$${val}`
        },
        splitLine: { lineStyle: { color: '#222' } }
    },
    series: [
        {
            name: 'Price',
            type: 'line',
            smooth: true, // Macht die Kurve "smooth" statt zackig
            showSymbol: false,
            data: props.lineChartDataY,//props.historyData.map(d => d.price),
            lineStyle: {
                width: 3,
                color: '#6366f1' // Indigo
            },
            // Area Style für den coolen Glow-Effekt unter der Linie
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
                        { offset: 1, color: 'rgba(99, 102, 241, 0)' }
                    ]
                }
            }
        }
    ]
}));
</script>

<template>
    <VChart :option="lineChartOptions" :loading="props.isLoading" :loading-options="props.loadingOptions" autoresize />
</template>

<style scoped></style>