import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from 'recharts';
import { Card, Tab, Tabs, Spinner, Form } from 'react-bootstrap';
import { FaWater, FaBolt, FaChartBar } from 'react-icons/fa';

const UtilityStats = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('electric');
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState([]);

    // Dữ liệu mẫu - thay bằng API thực tế
    const mockData = {
        electric: [
            { month: 'Tháng 1', usage: 1200, cost: 3600000 },
            { month: 'Tháng 2', usage: 1500, cost: 4500000 },
            { month: 'Tháng 3', usage: 1100, cost: 3300000 },
            { month: 'Tháng 4', usage: 1300, cost: 3900000 },
            { month: 'Tháng 5', usage: 1700, cost: 5100000 },
            { month: 'Tháng 6', usage: 1600, cost: 4800000 },
        ],
        water: [
            { month: 'Tháng 1', usage: 80, cost: 800000 },
            { month: 'Tháng 2', usage: 90, cost: 900000 },
            { month: 'Tháng 3', usage: 85, cost: 850000 },
            { month: 'Tháng 4', usage: 95, cost: 950000 },
            { month: 'Tháng 5', usage: 100, cost: 1000000 },
            { month: 'Tháng 6', usage: 110, cost: 1100000 },
        ],
    };

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            setData(mockData[activeTab]);
            setLoading(false);
        }, 800);
    }, [activeTab, year]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setLoading(true);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
        setLoading(true);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <Card className="shadow-sm mt-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title>
                        {activeTab === 'electric' ? (
                            <>
                                <FaBolt className="text-warning me-2" /> Thống kê điện
                            </>
                        ) : (
                            <>
                                <FaWater className="text-primary me-2" /> Thống kê nước
                            </>
                        )}
                    </Card.Title>

                    <div className="d-flex align-items-center">
                        <Form.Select
                            size="sm"
                            style={{ width: '100px' }}
                            value={year}
                            onChange={handleYearChange}
                        >
                            {[2023, 2022, 2021].map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>

                <Tabs activeKey={activeTab} onSelect={handleTabChange} className="mb-3">
                    <Tab eventKey="electric" title="Điện">
                        <div style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        yAxisId="left"
                                        label={{
                                            value: 'Số kWh',
                                            angle: -90,
                                            position: 'insideLeft',
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{
                                            value: 'Tiền (VND)',
                                            angle: 90,
                                            position: 'insideRight',
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === 'Lượng dùng')
                                                return [`${value} kWh`, name];
                                            return [formatCurrency(value), name];
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="usage"
                                        name="Lượng dùng"
                                        fill="#FFC107"
                                        barSize={60}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="cost"
                                        name="Chi phí"
                                        stroke="#FF5722"
                                        strokeWidth={2}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Tab>

                    <Tab eventKey="water" title="Nước">
                        <div style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        yAxisId="left"
                                        label={{
                                            value: 'Số m³',
                                            angle: -90,
                                            position: 'insideLeft',
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{
                                            value: 'Tiền (VND)',
                                            angle: 90,
                                            position: 'insideRight',
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === 'Lượng dùng') return [`${value} m³`, name];
                                            return [formatCurrency(value), name];
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="usage"
                                        name="Lượng dùng"
                                        fill="#2196F3"
                                        barSize={60}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="cost"
                                        name="Chi phí"
                                        stroke="#4CAF50"
                                        strokeWidth={2}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Tab>
                </Tabs>

                <div className="mt-3">
                    <h5>Tổng kết năm {year}</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <Card className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Title className="text-muted small">
                                                Tổng lượng dùng
                                            </Card.Title>
                                            <h4>
                                                {data.reduce((sum, item) => sum + item.usage, 0)}
                                                {activeTab === 'electric' ? ' kWh' : ' m³'}
                                            </h4>
                                        </div>
                                        <FaChartBar size={24} className="text-primary" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-6">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Title className="text-muted small">
                                                Tổng chi phí
                                            </Card.Title>
                                            <h4>
                                                {formatCurrency(
                                                    data.reduce((sum, item) => sum + item.cost, 0),
                                                )}
                                            </h4>
                                        </div>
                                        <FaChartBar size={24} className="text-success" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default UtilityStats;
