import { Product } from "../models/product.js";
import { Seller } from "../models/seller.js";
import { cloudinary } from "../config/cloudinary.js";

const productFilterAttributeKeys = new Set([
    "gender", "color", "fabric", "size", "occasion", "combo", "meeshoDeal", "meeshoMall",
    "fitShape", "countryOfOrigin", "material", "bottomLength", "printPatternType",
    "ornamentation", "bottomPatternType", "surfaceStyling", "neckType", "loomType",
    "compatibleModels", "waistRise", "bottomType", "dialDesign", "type"
]);

export const createProduct = async (req, res) => {
    try {
        // Verify seller approval and status
        if (req.user && String(req.user.role).toLowerCase() === 'seller') {
            if (req.user.status === 'blocked' || req.user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: "Your seller account has been blocked by admin. You cannot add products."
                });
            }
            const seller = await Seller.findOne({ userId: req.user._id || req.user.id });
            if (seller && !seller.isApproved) {
                return res.status(403).json({
                    success: false,
                    message: seller.isRejected
                        ? `Your seller application was rejected: ${seller.rejectionReason || "Please contact admin"}`
                        : "Your seller account is pending admin approval. You can add products once approved."
                });
            }
        }

        const { name, price, brand, stock, categoryId, discount, rating, attributes: attributesJson } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);
        const numericDiscount = Number(discount);
        const numericRating = Number(rating);
        let attributes = {};
        if (attributesJson) {
            try {
                attributes = JSON.parse(attributesJson);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Product attributes must be valid JSON."
                });
            }
            if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) {
                return res.status(400).json({
                    success: false,
                    message: "Product attributes must be an object."
                });
            }
        }
        const cleanAttributes = {};
        for (const [key, value] of Object.entries(attributes)) {
            if (!productFilterAttributeKeys.has(key)) continue;
            if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
                return res.status(400).json({
                    success: false,
                    message: `Product attribute "${key}" must be a list of text values.`
                });
            }
            cleanAttributes[key] = value
                .map((item) => item.trim().slice(0, 80))
                .filter(Boolean)
                .slice(0, 30);
        }

        if (!name?.trim() || !brand?.trim() || !categoryId ||
            !Number.isFinite(numericPrice) || numericPrice <= 0 ||
            !Number.isInteger(numericStock) || numericStock < 0 ||
            !Number.isFinite(numericDiscount) || numericDiscount < 0 || numericDiscount > 100 ||
            !Number.isFinite(numericRating) || numericRating < 0 || numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid product details"
            });
        }

        const payload = {
            name: name.trim(),
            price: numericPrice,
            brand: brand.trim(),
            stock: numericStock,
            categoryId,
            user: req.user.id,
            image: req.file.path,
            imagename: req.file.filename,
            discountPrice: numericPrice * (1 - numericDiscount / 100),
            discountPercent: numericDiscount,
            rating: numericRating,
            attributes: cleanAttributes
        };

        const product = await Product.create(payload);

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getproducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const perPage = 12;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);

    const products = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      success: true,
      message: "products fetched successfully",
      data: products,
      page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getproductsbyid = async (req, res) => {
    try {

        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(400).json({
                message: "product not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "product get successfully",
            success: true,
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const deleteproduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        let warning;
        if (product.imagename) {
            try {
                await cloudinary.uploader.destroy(product.imagename);
            } catch (error) {
                console.error("Product image cleanup failed:", error);
                warning = "The product was deleted, but its image could not be removed.";
            }
        }
        return res.status(200).json({
            message: "Product deleted successfully",
            success: true,
            warning
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updateproduct = async (req, res) => {
    try {
        const { name, price, brand, stock } = req.body;
        const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        if (name !== undefined) product.name = name.trim();
        if (price !== undefined) product.price = Number(price);
        if (brand !== undefined) product.brand = brand.trim();
        if (stock !== undefined) product.stock = Number(stock);

        const oldImageName = req.file ? product.imagename : null;
        if (req.file) {
            product.image = req.file.path;
            product.imagename = req.file.filename;
        }

        await product.save();

        let warning;
        if (oldImageName) {
            try {
                await cloudinary.uploader.destroy(oldImageName);
            } catch (error) {
                console.error("Previous product image cleanup failed:", error);
                warning = "The product was updated, but its previous image could not be removed.";
            }
        }
        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            data: product,
            warning
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const totalProduct = async (req, res) => {

    try {
        const product = await Product.find();
        return res.status(200).json({
            message: "get successfully",
            data: product.length + " " + "product",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const productbycategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Product.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }

        const products = await Product.find({ categoryId: req.params.id }).skip((page - 1) * perPage).limit(perPage).exec();;
        return res.status(200).json({
            messsage: "done",
            data: [products, "totalpage : " + totalpage, "count : " + products.length, "page no.: " + page],
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const setProductPricing = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, discountPrice } = req.body;

        // calculate discount percent automatically
        const discountPercent = discountPrice
            ? (((price - discountPrice) / price) * 100).toFixed(2)
            : null;

        const product = await Product.findByIdAndUpdate(
            id,
            {
                price,
                discountPrice,
                discountPercent
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Pricing updated successfully",
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


export const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const { id } = req.params;

        if (stock === undefined || stock === null) {
            return res.status(400).json({
                message: "Please provide stock value",
                success: false
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative",
                success: false
            });
        }


        const product = await Product.findOne({
            _id: id,
            user: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not authorized",
                success: false
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: { stock } },
            { new: true }
        );

        return res.status(200).json({
            message: "Stock updated successfully",
            success: true,
            data: {
                productId: updatedProduct._id,
                name: updatedProduct.name,
                previousStock: product.stock,
                updatedStock: updatedProduct.stock
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};