<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);


const option = ref({
    title: {
        text: "Portfolio",
        subtext: "Your assets on the xyz chain",
        left: "center",
        textStyle: {
            color: "#ffffff",          // Ein sehr dunkles Grau (fast Schwarz) wirkt moderner als pures Schwarz
            fontSize: 24,              // Etwas größer
            fontWeight: 600,           // Schön fett (Bold)
            fontFamily: "Monaco, sans-serif", // Nutze eine moderne Sans-Serif
            lineHeight: 30
        },

        // Styling für den Untertitel
        subtextStyle: {
            color: "#6b7280",          // Ein dezentes Grau (Slate-Gray)
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "Monaco, sans-serif",
        },
    },
    tooltip: { trigger: 'item', backgroundColor: 'rgba(255, 255, 255, 0.9)', },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'], // Erzeugt den modernen Ring-Look
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10, // Abgerundete Ecken für den modernen Look
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: true,
                fontSize: '18',
                color: 'rgba(255, 255, 255, 1)'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold',
                    formatter: '{b}\n{d}%' // Zeigt Name & Prozent in der Mitte an
                },
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            },
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' }
            ]
        },
    ],
});
</script>

<template>
    <div class="chartConatiner">
        <VChart class="chart" :option="option" autoresize />
    </div>
</template>

<style scoped>
.chartConatiner {
    width: 100%;
    height: 50rem;
}

.chart {
    height: 100%;
}
</style>