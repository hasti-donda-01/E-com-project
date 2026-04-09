import { Dispute } from "../models/dispute.js";
import { Order } from "../models/order.js";

export const raiseDispute = async (req, res) => {
    try {
        const { orderId, reason, description } = req.body;
        const userId = req.user.id;

        // check order belongs to this buyer
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Cannot raise dispute on cancelled order"
            });
        }

        const dispute = await Dispute.create({
            orderId,
            userId,
            sellerId: order.sellerId,
            reason,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Dispute raised successfully",
            dispute
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getAllDisputes = async (req, res) => {
    try {
        const { status } = req.query;

        const matchStage = {};
        if (status) matchStage.status = status;

        const disputes = await Dispute.aggregate([
            { $match: matchStage },

            { $lookup: {
                from:         'orders',
                localField:   'orderId',
                foreignField: '_id',
                as:           'order'
            }},
            { $unwind: '$order' },

            { $lookup: {
                from:         'users',
                localField:   'userId',
                foreignField: '_id',
                as:           'buyer'
            }},
            { $unwind: '$buyer' },

            { $lookup: {
                from:         'users',
                localField:   'sellerId',
                foreignField: '_id',
                as:           'seller'
            }},
            { $unwind: '$seller' },

            { $project: {
                _id:           1,
                reason:        1,
                description:   1,
                status:        1,
                resolution:    1,
                resolvedAt:    1,
                createdAt:     1,

                'order.totalAmount':  1,
                'order.orderStatus':  1,
                'order.paymentStatus': 1,

                'buyer.name':  1,
                'buyer.email': 1,

                'seller.name':  1,
                'seller.email': 1,
            }},

            { $sort: { createdAt: -1 } }
        ]);

        return res.status(200).json({
            success: true,
            total: disputes.length,
            disputes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const resolveDispute = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution, status } = req.body;
        // resolution: 'refund' | 'replacement' | 'rejected'
        // status:     'resolved' | 'rejected' | 'under_review'

        const dispute = await Dispute.findByIdAndUpdate(
            id,
            {
                resolution,
                status,
                resolvedAt: new Date()
            },
            { new: true }
        );

        if (!dispute) {
            return res.status(404).json({
                success: false,
                message: "Dispute not found"
            });
        }

        // if refund → update order status
        if (resolution === 'refund') {
            await Order.findByIdAndUpdate(dispute.orderId, {
                orderStatus: 'cancelled',
                cancelledAt: new Date()
            });
        }

        return res.status(200).json({
            success: true,
            message: `Dispute ${status}`,
            dispute
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};