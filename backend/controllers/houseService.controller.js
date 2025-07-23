const HouseService = require('../models/HouseService');

const createHouseService = async (req, res) => {
    try {
        const { name, unit, price } = req.body;

        const newService = await HouseService.create({ name, unit, price });

        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Tạo dịch vụ thất bại', error: error.message });
    }
};

const getAllHouseServices = async (req, res) => {
    try {
        const services = await HouseService.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error: error.message });
    }
};

const getHouseServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await HouseService.findById(id);

        if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dịch vụ', error: error.message });
    }
};

const updateHouseService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, unit, price } = req.body;

        const updated = await HouseService.findByIdAndUpdate(
            id,
            { name, unit, price },
            { new: true },
        );

        if (!updated)
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ để cập nhật' });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Cập nhật dịch vụ thất bại', error: error.message });
    }
};

const deleteHouseService = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await HouseService.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy dịch vụ để xóa' });

        res.status(200).json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Xóa dịch vụ thất bại', error: error.message });
    }
};

module.exports = {
    createHouseService,
    getAllHouseServices,
    getHouseServiceById,
    updateHouseService,
    deleteHouseService,
};
