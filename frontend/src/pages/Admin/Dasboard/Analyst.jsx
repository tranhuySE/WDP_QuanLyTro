import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Table, Tab, Tabs } from 'react-bootstrap';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { FaMoneyBillWave, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import { BsFillHouseFill } from 'react-icons/bs';
import { MdPayments } from 'react-icons/md';
import UtilityStats from './Water_electric';
import { getStats } from '../../../api/invoiceAPI';

const Analyst = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: {
            total: 0,
            thisMonth: 0,
            lastMonth: 0,
            trend: 0,
        },
        debt: {
            total: 0,
            overdue: 0,
            trend: 0,
        },
        occupancy: {
            totalRooms: 0,
            occupied: 0,
            rate: 0,
            trend: 0,
        },
        recentPayments: [],
        monthlyRevenue: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                const mockData = data.data;

                setStats(mockData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const renderTrendIndicator = (value) => {
        if (value > 0) {
            return (
                <span className="text-success">
                    +{value}% <FaChartLine />
                </span>
            );
        } else if (value < 0) {
            return (
                <span className="text-danger">
                    {value}% <FaChartLine />
                </span>
            );
        } else {
            return <span className="text-muted">{value}%</span>;
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Đang tải dữ liệu thống kê...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="">
            <h2 className="mb-4">Thống Kê Hệ Thống</h2>

            {/* Các chỉ số chính */}
            <Row className="mb-4">
                <Col md={3} className="mb-3">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="text-muted small">
                                        Tổng Doanh Thu
                                    </Card.Title>
                                    <h3 className="mb-0">{formatCurrency(stats.revenue.total)}</h3>
                                    <small className="text-muted">
                                        Tháng này: {formatCurrency(stats.revenue.thisMonth)}{' '}
                                        {renderTrendIndicator(stats.revenue.trend)}
                                    </small>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded">
                                    <FaMoneyBillWave size={24} className="text-primary" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mb-3">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="text-muted small">Công Nợ</Card.Title>
                                    <h3 className="mb-0">{formatCurrency(stats.debt.total)}</h3>
                                    <small className="text-muted">
                                        Quá hạn: {formatCurrency(stats.debt.overdue)}{' '}
                                        {renderTrendIndicator(stats.debt.trend)}
                                    </small>
                                </div>
                                <div className="bg-danger bg-opacity-10 p-3 rounded">
                                    <FaExclamationTriangle size={24} className="text-danger" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mb-3">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="text-muted small">
                                        Tỷ Lệ Lấp Đầy
                                    </Card.Title>
                                    <h3 className="mb-0">{stats.occupancy.rate}%</h3>
                                    <small className="text-muted">
                                        {stats.occupancy.occupied}/{stats.occupancy.totalRooms}{' '}
                                        phòng {renderTrendIndicator(stats.occupancy.trend)}
                                    </small>
                                    <ProgressBar
                                        now={stats.occupancy.rate}
                                        variant={
                                            stats.occupancy.rate > 80
                                                ? 'success'
                                                : stats.occupancy.rate > 50
                                                ? 'warning'
                                                : 'danger'
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded">
                                    <BsFillHouseFill size={24} className="text-success" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mb-3">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="text-muted small">
                                        Thanh Toán Gần Đây
                                    </Card.Title>
                                    <h3 className="mb-0">{stats.recentPayments.length}</h3>
                                    <small className="text-muted">
                                        Tổng:{' '}
                                        {formatCurrency(
                                            stats.recentPayments.reduce(
                                                (sum, p) => sum + p.amount,
                                                0,
                                            ),
                                        )}
                                    </small>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded">
                                    <MdPayments size={24} className="text-info" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="overview" className="mb-3" justify>
                <Tab eventKey="overview" title="Doanh thu">
                    <Row className="mt-3">
                        <div style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return `${value / 1000000}M`;
                                            if (value >= 1000) return `${value / 1000}K`;
                                            return value;
                                        }}
                                        domain={[0, 'dataMax + 10000000']}
                                    />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        labelFormatter={(label) => `Tháng: ${label}`}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="revenue"
                                        name="Doanh thu"
                                        fill="#8884d8"
                                        radius={[2, 2, 0, 0]}
                                        barSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Row>
                </Tab>

                <Tab eventKey="payments" title="Thanh Toán">
                    <Card className="shadow-sm mt-3">
                        <Card.Body>
                            <Card.Title>Danh Sách Thanh Toán Gần Đây</Card.Title>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Phòng</th>
                                        <th>Người Thuê</th>
                                        <th>Số Tiền</th>
                                        <th>Ngày</th>
                                        <th>Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentPayments.map((payment, index) => (
                                        <tr key={payment.id}>
                                            <td>{index + 1}</td>
                                            <td>{payment.room}</td>
                                            <td>{payment.tenant}</td>
                                            <td>{formatCurrency(payment.amount)}</td>
                                            <td>{payment.date}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        payment.status === 'paid'
                                                            ? 'bg-success'
                                                            : 'bg-danger'
                                                    }`}
                                                >
                                                    {payment.status === 'paid'
                                                        ? 'Đã thanh toán'
                                                        : 'Quá hạn'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="debts" title="Công Nợ">
                    <Row className="mt-3">
                        <Col md={12}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Thống Kê Công Nợ</Card.Title>
                                    <p>
                                        Tổng công nợ:{' '}
                                        <strong>{formatCurrency(stats.debt.total)}</strong>
                                    </p>
                                    <p>
                                        Công nợ quá hạn:{' '}
                                        <strong className="text-danger">
                                            {formatCurrency(stats.debt.overdue)}
                                        </strong>
                                    </p>

                                    <div style={{ height: '300px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={[
                                                    {
                                                        name: 'Tổng công nợ',
                                                        value: stats.debt.total,
                                                    },
                                                    {
                                                        name: 'Công nợ quá hạn',
                                                        value: stats.debt.overdue,
                                                    },
                                                ]}
                                                layout="vertical"
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="name" type="category" />
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(value)}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    name="Số tiền"
                                                    fill="#ff6b6b"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Analyst;
