import express from 'express';
import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    category_name: {
        type: String,
        require: true
    },
    category_Image: {
        type: String,
        require: true
    },
    imagename: {
        type: String,
        require: true
    }
});

export const Category = mongoose.model('Category', categorySchema)