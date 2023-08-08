const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .then((product) => {
      product.populate("category");
      req.product = product;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({ error: "Product not found" });
      }
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Cannot upload the file" });
    }

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please provide all the fields" });
    }
    const product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 5242880) {
        return res.status(400).json({ error: "File size is too big" });
      }

      product.photo.data = fs.readFileSync(file.photo[0].filepath);
      product.photo.contentType = file.photo[0].mimetype;
      product.name = name[0];
      product.description = description[0];
      product.price = price[0];
      product.category = category[0];
      product.stock = stock[0];
    }
    product
      .save()
      .then((product) => res.json(product))
      .catch((err) => {
        if (err) {
          return res.status(400).json({ error: "Error saving product in DB" });
        }
      });
  });
};

exports.getProduct = (req, res, id) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.getProductPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Cannot update the file" });
    }

    const product = req.product;
    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 5242880) {
        return res.status(400).json({ error: "File size is too big" });
      }

      product.photo.data = fs.readFileSync(file.photo[0].filepath);
      product.photo.contentType = file.photo[0].mimetype;
      product.name = name[0];
      product.description = description[0];
      product.price = price[0];
      product.category = category[0];
      product.stock = stock[0];
    }
    product
      .save()
      .then((product) => res.json(product))
      .catch((err) => {
        if (err) {
          return res.status(400).json({ error: "Error saving product in DB" });
        }
      });
  });
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product
    .deleteOne()
    .then((removedProduct) => {
      return res.json({
        message: `${removedProduct.name} category is successfully deleted`,
      });
    })
    .catch((err) => {
      if (err)
        return res
          .status(400)
          .json({ error: `Failed to delete ${removedProduct.name}` });
    });
};

exports.getAllProducts = (req, res) => {
  Product.find({})
    .then((allProducts) => {
      return res.status(200).json({ allProducts });
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({ error: "Oops!!! So empty..." });
      }
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category")
    .then((allCategories) => res.json(allCategories))
    .catch((err) => {
      if (err) return res.status(400).json({ error: "No category found" });
    });
};

exports.updateStock = (req, res, next) => {
  const myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(myOperations)
    .then((response) => {
      next();
    })
    .catch((err) => {
      if (err)
        return res.status(400).json({ error: "Bulk operation is failed" });
    });
};
