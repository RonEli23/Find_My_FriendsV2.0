// import recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from "recharts";
// import our components
import { chartData, pieData } from '../../services/statisticsData';
// import css
import '../../assets/css/Statistics.css';

const Statistics = () => {
    return (
        <div>
            <h2 layout="horizontal" align="center">הנתונים מדברים בעד עצמם</h2>
            <p align="center" className="statMsg">*הנתונים המוצגים סטטיים</p>
            <div className="wrapper">
                <LineChart width={500} height={300} data={chartData} className="first" >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" />
                    <Line
                        type="monotone"
                        dataKey="חתולים"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="כלבים"
                        stroke="#82ca9d" />
                </LineChart>
                <PieChart width={400} height={400} className="second">
                    <Legend layout="horizontal" verticalAlign="top" align="center" />
                    <Pie
                        dataKey="numberOfAnimals"
                        isAnimationActive={false}
                        data={pieData}
                        cx={180}
                        cy={150}
                        outerRadius={80}
                        fill={pieData.fill}
                        label
                    />
                    <Tooltip />
                </PieChart>
            </div>
        </div>
    );
}

export default Statistics;