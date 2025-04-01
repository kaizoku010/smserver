import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    // console.log("Fetching all products...");
    const products = await Product.find().sort({ createdAt: -1 });
    // console.log("Products retrieved:", products.length);
    
    if (!products) {
      return res.status(404).json({ 
        success: false,
        message: 'No products found' 
      });
    }

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    console.log('Create Product Request Body:', req.body);
    const { name, description, price, image, category, stock, reviews } = req.body;
    const product = new Product({
      name,
      reviews,
      sku,
      description,
      price,
      image,
      category,
      stock
    });
    const savedProduct = await product.save();
    console.log('Product created successfully:', savedProduct);

    // Send the saved product with 201 status
    return res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update product (admin only)
router.put('/:id', [verifyToken, isAdmin], async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
