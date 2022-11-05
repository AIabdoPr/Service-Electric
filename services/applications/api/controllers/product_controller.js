const fs = require('fs');
const Controller = require('../../../../lib/pkgs/controller');
const Consts = require('../../../../src/consts');
const Environment = require('../../../../src/environment');
const FileModel = require('../../../models/file_model');
const ProductModel = require('../../../models/product_model');

class ProductController extends Controller{

  static async filterProducts(products, type, _getRows = true) {
    const productModel = new ProductModel();
    if (_getRows) products = await ProductController.getRows(products, productModel, type != 'delete');
    var nProducts = type == 'delete' ? [] : {};
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (type == 'delete') {
        nProducts.push(product.id);
      } else {
        nProducts[product.id] = product;
      }
    }
    return nProducts;
  }

  static async onProductsUpdate(event) {
    for (var productId in Environment.socketClients.admin) {
      const socketClient = Environment.socketClients.admin[productId];
      if (socketClient.events && socketClient.events.indexOf('products') != -1) {
        var products = await ProductController.filterProducts(
          event.affectedRows,
          event.type.toLowerCase(),
        );
        ProductController.emitProducts(socketClient, event.type.toLowerCase(), products);
      }
    }
  }

  static async getAll() {
    return await new ProductModel().all(true, true);
  }

  static async sendData(socketClient) {
    ProductController.emitProducts(
      socketClient,
      'insert',
      await ProductController.filterProducts(
        await ProductController.getAll(),
        'insert',
        false
      ),
    );
  }

  static emitProducts(socketClient, type, products) {
    socketClient.emit('products-update', type, products);
  }

  // Crud
  static async createProduct(request, response) {
  // static async createProduct(socketClient, request) {
    const productModel = new ProductModel();
    const fileModel = new FileModel();
    var success = false;
    var message = null;
    console.log(request);
    try {
      if (!request.name &&
          !request.user_id &&
          !request.price &&
          !request.category &&
          !request.description) {
        message = 'Please fill all data';
      } else {
        const productId = await productModel.lastId() + 1;
        var values = {
          id: productId,
          name: request.name,
          user_id: request.user_id,
          price: request.price,
          category: request.category,
          description: request.description,
        }
        values.images_ids = [];
        values.tags = request.tags ?? [];
        for (const key in request.files) {
          let image = request.files[key];

          let userFilesPath = `${Consts.APP_PATH}/services/general_storage/api/${request.user_id}`;
          if(!fs.existsSync(userFilesPath)) {
            fs.mkdirSync(userFilesPath);
            userFilesPath = `${userFilesPath}/products`
            fs.mkdirSync(userFilesPath);
          }
          let productDirPath = `${userFilesPath}/${productId}`;
          if(!fs.existsSync(productDirPath)) fs.mkdirSync(productDirPath);
          const imageName = `${request.user_id}-${productId}-${new Date().getTime()}`;

          let path = `${productDirPath}/${imageName}`;
          var imageFile = fs.readFileSync(image.path);
          fs.appendFileSync(path, imageFile);

          await fileModel.create({ name: imageName, path: path });
          values.images_ids.push(imageName);
        }
        await productModel.create(values);
        message = 'Successfully adding product';
        success = true;
      }
    } catch (error) {
      console.log(error);
      message = 'Some things worng';
    }
    response.json({
      success: success,
      message: message,
    })
    // socketClient.emit('create-product-result', success, message);
  }

  static async updateProduct(request, response) {
    const productModel = new ProductModel();
    var success = false;
    var message = null;
    if (request.id && await productModel.find(request.id)) {
      if (!request.name &&
          !request.price &&
          !request.category &&
          !request.description) {
        message = 'Please fill all data';
      } else {
        try {
          var values = {
            name: request.name,
            price: request.price,
            category: request.category,
            description: request.description,
          }
          await productModel.update(request.id, values);
          message = 'Successfully updateing product data';
          success = true;
        } catch (error) {
          console.log(error)
          message = 'Some thigns worng';
        }
      }
    } else {
      message = 'Invalid product id';
    }
    socketClient.emit('product-update-result', success, message);
  }

  static async deleteProduct(request, response) {
    const productModel = new ProductModel();
    var success = false;
    var message = null
    try {
      if ((await productModel.delete(request.product_id)).affectedRows > 0) {
        message = 'Successfully deleteing product';
        success = true;
      } else {
        message = 'Invalid product Id';
      }
    } catch (error) {
      console.log(error)
      message = 'Some things worng';
    }
    return response.json({
      success: success,
      message: message,
    })
  }

  static async productImage(request, response) {
    const fileModel = new FileModel();
    var file = await fileModel.find(request.filename, 'name');
    if(file) {
      if(fs.existsSync(file.path)) {
        return response.download(file.path);
      } else {
        console.log('file is not exists: ', file);
      }
    }
    return response.status(404, `file ' ${request.filename} ' not exists`);
  }

  static testuploadFile(request, response) {
    console.log(request);
    response.json({
      success: true
    });
  }

}

module.exports = ProductController;